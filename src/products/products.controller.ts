import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // /products?page=1&limit=10
  @Get()
  async getProducts(@Query() dto: GetProductsDto) {
    return await this.productsService.getProducts(dto);
  }

  @Get('category/:category')
  async getProductsByCategory(@Param('category') category: string) {
    return `Товары из категории: ${category}`;
  }

  @Get('category/:category/:id')
  async getProductByCategoryAndId(
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    return `Товар с ID: ${id} из категории: ${category}`;
  }
}
