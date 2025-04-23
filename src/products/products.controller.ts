import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // /products
  // /products?page=1&limit=10
  @Get()
  async getProducts(@Query() dto: GetProductsDto) {
    return await this.productsService.getProducts(dto);
  }

  // /products/MacBook%20Pro
  // /products/MacBook%20Pro?page=1&limit=10
  @Get('category/:category')
  async getProductsByCategory(
    @Query() dto: GetProductsDto,
    @Param('category') category: string,
  ) {
    return await this.productsService.getProducts(dto, category);
  }

  @Get('category/:category/:id')
  async getProductByCategoryAndId(
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    return `Товар с ID: ${id} из категории: ${category}`;
  }
}
