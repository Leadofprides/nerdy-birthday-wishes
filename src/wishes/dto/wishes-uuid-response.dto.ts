import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Wish } from '../entities/wish.entity';

export class WishesUuidResponseDto extends Wish {
  @ApiProperty()
  @IsNotEmpty({ message: 'wishes_uuid should not be empty' })
  @IsString({ message: 'wishes_uuid must be string' })
  readonly wishes_uuid: string;
}
