import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersDto } from './dto/users.dto';
import { UsersCreateDto } from './dto/users-create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(user: UsersCreateDto): Promise<UsersDto> {
    return await this.usersRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<UsersDto> {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }
}
