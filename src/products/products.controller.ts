import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';
import { CategoryParamDto } from './dto/category-param.dto';
import { CategoryEnum } from './types/category.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query() dto: GetProductsDto) {
    return await this.productsService.getAllProducts(dto);
  }

  @Get(':category')
  async getProductsByCategory(
    @Param() { category }: { category: CategoryEnum },
    @Query() dto: GetProductsDto,
  ) {
    return await this.productsService.getProductsByCategory(dto, category);
  }

  @Get(':category/:id')
  async getProductById(
    @Param() { category, id }: { category: CategoryEnum; id: string },
  ) {
    return await this.productsService.getProductById(id);
  }
}
