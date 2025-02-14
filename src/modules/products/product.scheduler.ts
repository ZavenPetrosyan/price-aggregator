import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductService } from './product.service';

@Injectable()
export class ProductScheduler implements OnModuleInit {
  constructor(private readonly productService: ProductService) {}

  async onModuleInit() {
    await this.fetchAndStoreProducts();
  }

  @Cron('*/5 * * * *')
  async fetchAndStoreProducts() {
    console.log('Fetching data from providers...');
    await this.productService.fetchAndStoreProducts();
  }
}
