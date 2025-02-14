import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(private jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const { username, password } = dto;
    let user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log(`User not found, creating new user: ${username}`);

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      console.log(`New user created: ${username}`);
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
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
