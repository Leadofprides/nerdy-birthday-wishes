import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Wish } from '../entities/wish.entity';

export class WishesResultDto extends Wish {
  @ApiProperty()
  @IsNotEmpty({ message: 'pow_nonce should not be empty' })
  @IsNumber(null, { message: 'pow_nonce must be number' })
  readonly pow_nonce: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'hash should not be empty' })
  @IsString({ message: 'hash must be string' })
  readonly hash: string;
}
