import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Wishes } from "../entities/wishes.entity"
import { WishesStatus } from '../enums/wishes-status.enum'

export class WishesStatusDto extends Wishes {
    @ApiProperty()
    @IsNotEmpty({ message: 'wishes_status should not be empty' })
    @IsString({ message: 'wishes_status must be string' })
    wishes_status: WishesStatus;
}