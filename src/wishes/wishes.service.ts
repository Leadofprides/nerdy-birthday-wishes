import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from 'worker_threads';
import { interpret } from 'xstate';
import { wishesStateMachine } from './wishes-state-machine';
import { Wish } from './entities/wish.entity';
import { WishesCreateDto } from './dto/wishes-create.dto';
import { WishesUuidResponseDto } from './dto/wishes-uuid-response.dto';
import { WishesStatus } from './enums/wishes-status.enum';
import { WishesStatusDto } from './dto/wishes-status.dto';
import { WishesResultDto } from './dto/wishes-result.dto';

@Injectable()
export class WishesService {
  private readonly MAX_WORKERS = 10;
  private workerQueue: any[] = [];
  private activeWorkers: number = 0;
  private wishesStateServices: Map<string, any> = new Map();

  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async prepareWishes(
    wishes_body: WishesCreateDto,
  ): Promise<WishesUuidResponseDto> {
    const wish = new Wish();
    wish.wishes_uuid = uuidv4();
    wish.wishes_body = wishes_body;
    wish.pow_nonce = 0;
    const savedWish = await this.wishesRepository.save(wish);

    const wishesStateService = interpret(wishesStateMachine).start();
    this.wishesStateServices.set(savedWish.wishes_uuid, wishesStateService);

    this.queueComputation(savedWish.wishes_uuid, wishes_body);
    return { wishes_uuid: savedWish.wishes_uuid } as WishesUuidResponseDto;
  }

  private queueComputation(wishes_uuid: string, wishes_body: WishesCreateDto) {
    this.workerQueue.push({ wishes_uuid, wishes_body });
    this.processQueue();
  }

  private processQueue() {
    if (this.activeWorkers < this.MAX_WORKERS && this.workerQueue.length) {
      const task = this.workerQueue.shift();
      this.startWorker(task.wishes_uuid, task.wishes_body);
    }
  }

  startWorker(wishes_uuid: string, wishes_body: WishesCreateDto) {
    this.activeWorkers++;

    const worker = new Worker(path.join(__dirname, 'wishes-computation'), {
      workerData: wishes_body,
    });

    worker.on('message', async (data) => {
      const wish = await this.wishesRepository.findOne({
        where: { wishes_uuid },
      });

      const wishesStateService = this.wishesStateServices.get(wishes_uuid);

      if (data.type === 'START') {
        wishesStateService.send('START');
        wish.computation_started_at = data.computation_started_at;
        wish.wishes_status = WishesStatus[wishesStateService.state.value];
      } else if (data.type === 'COMPLETE') {
        wishesStateService.send('COMPLETE');
        wish.computation_finished_at = data.computation_finished_at;
        wish.pow_nonce = data.pow_nonce;
        wish.hash = data.hash;
        wish.done_by_worker_id = data.thread_id;
        wish.wishes_status = WishesStatus[wishesStateService.state.value];
        this.activeWorkers--;
        this.processQueue();
        this.cleanupWishesStateMachine(wishes_uuid);
      }

      await this.wishesRepository.save(wish);
    });
  }

  private cleanupWishesStateMachine(wishes_uuid: string) {
    this.wishesStateServices.delete(wishes_uuid);
  }

  async checkWishesStatus(wishes_uuid: string): Promise<WishesStatusDto> {
    const wishesStateService = this.wishesStateServices.get(wishes_uuid);
    const wishesStatus = new WishesStatusDto();
    if (wishesStateService) {
      wishesStatus.wishes_status = WishesStatus[wishesStateService.state.value];
    } else {
      const wish = await this.wishesRepository.findOne({
        where: { wishes_uuid },
      });
      if (!wish) {
        throw new NotFoundException(
          `Wish with wishes_uuid ${wishes_uuid} not found`,
        );
      }
      wishesStatus.wishes_status = wish.wishes_status;
    }
    return wishesStatus;
  }

  async getResult(wishes_uuid: string): Promise<WishesResultDto> {
    const wish = await this.wishesRepository.findOne({
      where: { wishes_uuid },
    });

    if (!wish) {
      throw new NotFoundException(
        `Wish with wishes_uuid ${wishes_uuid} not found`,
      );
    }
    if (!wish.computation_finished_at) {
      return null;
    }

    return {
      pow_nonce: wish.pow_nonce,
      hash: wish.hash,
    } as WishesResultDto;
  }
}
