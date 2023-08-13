import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Wishes } from "../entities/wishes.entity"

export class WishesResultDto extends Wishes {
    @ApiProperty()
    @IsNotEmpty({ message: 'pow_nonce should not be empty' })
    @IsNumber(null,{ message: 'pow_nonce must be number' })
    readonly pow_nonce: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'hash should not be empty' })
    @IsString({ message: 'hash must be string' })
    readonly hash: string;
}