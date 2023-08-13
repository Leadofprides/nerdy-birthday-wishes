import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Wishes } from '../entities/wishes.entity';

export class WishesUuidResponseDto extends Wishes {
  @ApiProperty()
  @IsNotEmpty({ message: 'wishes_uuid should not be empty' })
  @IsString({ message: 'wishes_uuid must be string' })
  readonly wishes_uuid: string;
}
