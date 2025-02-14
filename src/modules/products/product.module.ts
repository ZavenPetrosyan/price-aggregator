import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from '../../database/prisma.service';
import { ProductController } from './product.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductScheduler } from './product.scheduler';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ProductScheduler],
})
export class ProductModule {}
