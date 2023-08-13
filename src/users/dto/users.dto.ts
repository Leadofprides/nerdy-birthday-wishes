import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class UsersDto extends User {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;
}
