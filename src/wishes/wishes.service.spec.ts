import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { WishesService } from './wishes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { NotFoundException } from '@nestjs/common';
import { WishesCreateDto } from './dto/wishes-create.dto';

jest.mock('worker_threads', () => ({
  Worker: jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
    };
  }),
}));

describe('WishesService', () => {
  let service: WishesService;
  let mockRepository;
  let wishes_uuid: string;
  let wishes_body: WishesCreateDto;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishesService,
        {
          provide: getRepositoryToken(Wish),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WishesService>(WishesService);
    wishes_uuid = uuidv4();
    wishes_body = {
      wishes: 'Test wishes!',
      from: 'Test user 1',
      to: 'Test user 2',
    } as WishesCreateDto;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('prepareWishes', () => {
    it('should save and return the wish', async () => {
      const mockWish = { wishes_uuid, wishes_body };
      mockRepository.save.mockReturnValueOnce(mockWish);

      const result = await service.prepareWishes(wishes_body);
      expect(result).toEqual({ wishes_uuid });
    });
  });

  describe('checkWishesStatus', () => {
    it('should return AWAITING_CPU status', async () => {
      const mockWish = { wishes_body, wishes_status: 'Awaiting CPU core' };
      mockRepository.findOne.mockReturnValueOnce(mockWish);

      const result = await service.checkWishesStatus(wishes_uuid);
      expect(result.wishes_status).toEqual('Awaiting CPU core');
    });

    it('should throw NotFoundException if wish is not found', async () => {
      mockRepository.findOne.mockReturnValueOnce(undefined);

      await expect(service.checkWishesStatus('fake_uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getResult', () => {
    it('should return wish result', async () => {
      const mockWish = {
        computation_finished_at: new Date(),
        pow_nonce: 160,
        hash: '005b136e779ae112f85f0620312059ee7d4222143635bfecaee28dc4f7d87d73',
      };
      mockRepository.findOne.mockReturnValueOnce(mockWish);

      const result = await service.getResult(wishes_uuid);
      expect(result).toEqual({
        pow_nonce: 160,
        hash: '005b136e779ae112f85f0620312059ee7d4222143635bfecaee28dc4f7d87d73',
      });
    });

    it('should throw NotFoundException if wish is not found', async () => {
      mockRepository.findOne.mockReturnValueOnce(undefined);

      await expect(service.getResult('fake_uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('processQueue', () => {
    it('should process queue if there are available workers and tasks', () => {
      service['activeWorkers'] = 9;
      service['workerQueue'].push({ wishes_uuid, wishes_body });

      const startWorkerSpy = jest.spyOn(service, 'startWorker');
      service['processQueue']();

      expect(startWorkerSpy).toBeCalledWith(wishes_uuid, wishes_body);
    });

    it('should not process queue if max workers reached', () => {
      service['activeWorkers'] = 10;
      service['workerQueue'].push({ wishes_uuid, wishes_body });

      const startWorkerSpy = jest.spyOn(service, 'startWorker');
      service['processQueue']();

      expect(startWorkerSpy).not.toBeCalled();
    });

    it('should not process queue if no tasks available', () => {
      service['activeWorkers'] = 9;
      const startWorkerSpy = jest.spyOn(service, 'startWorker');
      service['processQueue']();

      expect(startWorkerSpy).not.toBeCalled();
    });
  });

  describe('startWorker', () => {
    it('should increase the number of active workers', () => {
      service['activeWorkers'] = 0;

      service['startWorker'](wishes_uuid, wishes_body);

      expect(service['activeWorkers']).toBe(1);
    });
  });
});
