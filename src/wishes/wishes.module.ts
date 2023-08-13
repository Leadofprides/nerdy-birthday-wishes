import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wishes } from './entities/wishes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishes])],
  providers: [WishesService],
  controllers: [WishesController],
})
export class WishesModule {}
