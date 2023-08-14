import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Wish } from '../entities/wish.entity';
import { WishesStatus } from '../enums/wishes-status.enum';

export class WishesStatusDto extends Wish {
  @ApiProperty()
  @IsNotEmpty({ message: 'wishes_status should not be empty' })
  @IsString({ message: 'wishes_status must be string' })
  wishes_status: WishesStatus;
}
