import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Wish } from '../entities/wish.entity';

export class WishesCreateDto extends Wish {
  @ApiProperty()
  @IsNotEmpty({ message: 'wishes should not be empty' })
  @IsString({ message: 'wishes must be string' })
  readonly wishes: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'from should not be empty' })
  @IsString({ message: 'from must be string' })
  readonly from: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'to should not be empty' })
  @IsString({ message: 'to must be string' })
  readonly to: string;
}
