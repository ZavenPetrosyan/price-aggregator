import {
  Controller,
  Get,
  Query,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductChangesDto, ProductQueryDto } from './dto/product-query.dto';
import { ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('changes')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiQuery({
    name: 'since',
    required: true,
    type: String,
    description: 'ISO timestamp',
  })
  async getProductChanges(@Query() filters: ProductChangesDto) {
    const result = await this.productService.getProductChanges(filters.since);
    return result;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'currency', required: false })
  @ApiQuery({ name: 'availability', required: false, type: Boolean })
  @ApiQuery({ name: 'provider', required: false })
  async getProducts(@Query() filters: ProductQueryDto) {
    return this.productService.getProducts(filters);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
