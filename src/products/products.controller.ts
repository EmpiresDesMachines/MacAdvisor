import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';
import { CategoryParamDto } from './dto/category-param.dto';
import { CategoryEnum } from './types/category.enum';

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
    //@Param('category') category: string,
    @Param() { category }: CategoryParamDto,
  ) {
    return await this.productsService.getProducts(
      dto,
      category as CategoryEnum,
    );
  }

  // /products/category/MacBook Air/3baad9d5-3fa9-4ddc-b507-45a95e3ca56b
  @Get('category/:category/:id')
  async getProductsById(
    @Query() dto: GetProductsDto,
    //@Param('category') category: string,
    @Param() { category, id }: CategoryParamDto,
  ) {
    return await this.productsService.getProducts(
      dto,
      category as CategoryEnum,
      id,
    );
  }
}
