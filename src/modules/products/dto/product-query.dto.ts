import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  availability?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  provider?: string;
}

export class ProductChangesDto {
  @IsISO8601({}, { message: 'since must be a valid ISO 8601 timestamp' })
  since: string;
}
