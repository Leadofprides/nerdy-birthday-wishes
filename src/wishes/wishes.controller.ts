import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WishesService } from './wishes.service';
import { WishesCreateDto } from './dto/wishes-create.dto';
import { WishesUuidResponseDto } from './dto/wishes-uuid-response.dto';
import { WishesStatusDto } from './dto/wishes-status.dto';
import { WishesResultDto } from './dto/wishes-result.dto';

@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiResponse({ status: 201, type: WishesUuidResponseDto })
  @ApiBearerAuth()
  @Post('prepare')
  @UseGuards(AuthGuard('jwt'))
  prepareWishes(
    @Body() wishes_body: WishesCreateDto,
  ): Promise<WishesUuidResponseDto> {
    return this.wishesService.prepareWishes(wishes_body);
  }

  @ApiResponse({ status: 200, type: WishesStatusDto })
  @ApiBearerAuth()
  @Get('status/:wishes_uuid')
  @UseGuards(AuthGuard('jwt'))
  checkWishesStatus(
    @Param('wishes_uuid') wishes_uuid: string,
  ): Promise<WishesStatusDto> {
    return this.wishesService.checkWishesStatus(wishes_uuid);
  }

  @ApiResponse({ status: 200, type: WishesResultDto })
  @ApiBearerAuth()
  @Get('result/:wishes_uuid')
  @UseGuards(AuthGuard('jwt'))
  getResult(
    @Param('wishes_uuid') wishes_uuid: string,
  ): Promise<WishesResultDto> {
    return this.wishesService.getResult(wishes_uuid);
  }
}
