import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Module({})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  private prisma = new PrismaClient();

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      console.log('✅ PostgreSQL Connected Successfully');
    } catch (error) {
      console.error('❌ PostgreSQL Connection Error:', error);
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('🔻 PostgreSQL Disconnected');
  }

  getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}
