import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;
    let user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log(`User not found, creating new user: ${username}`);

      const hashedPassword = this.hashPassword(password);
      user = await this.prisma.user.create({
        data: {
          username: username,
          email: `${username}@example.com`,
          password: hashedPassword,
        },
      });

      console.log(`New user created: ${username}`);
    } else {
      const hashedPassword = this.hashPassword(password);
      if (hashedPassword !== user.password) {
        throw new BadRequestException('Invalid credentials');
      }
    }

    const token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    });

    console.log(`JWT issued for user: ${username}`);
    return { accessToken: token };
  }
}
