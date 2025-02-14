import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../database/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  private providers = [
    'http://provider1:4001/products',
    'http://provider2:4002/products',
    'http://provider3:4003/products',
  ];

  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async fetchAndStoreProducts() {
    for (const providerUrl of this.providers) {
      try {
        console.log(`Fetching data from ${providerUrl}...`);
        const response = await firstValueFrom(this.http.get(providerUrl));
        const products = response.data;

        for (const product of products) {
          await this.prisma.product.upsert({
            where: { id: product.id },
            update: { ...product, lastUpdated: new Date() },
            create: { ...product, lastUpdated: new Date() },
          });
        }
      } catch (error) {
        console.error(`Failed to fetch from ${providerUrl}:`, error.message);
      }
    }
  }

  async getProducts(filters: any) {
    return this.prisma.product.findMany({
      where: {
        name: filters.name ? { contains: filters.name } : undefined,
        price: {
          gte: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
          lte: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        },
        currency: filters.currency || undefined,
        availability:
          filters.availability !== undefined ? filters.availability : undefined,
      },
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductChanges(since: string) {
    console.log('getProductChanges called with since:', since);

    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      console.error('Invalid date format:', since);
      throw new Error(
        'Invalid date format. Please provide a valid ISO timestamp.',
      );
    }

    console.log('Filtering products updated since:', sinceDate);

    const result = await this.prisma.product.findMany({
      where: {
        lastUpdated: {
          gte: sinceDate,
        },
      },
    });

    console.log('Query result:', result);

    return result;
  }
}
