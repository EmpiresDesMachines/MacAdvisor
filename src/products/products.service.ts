import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetProductsDto } from './dto/get-products.dto';
import { CategoryEnum } from './types/category.enum';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async getProducts(
    { page, limit }: GetProductsDto = {},
    category?: CategoryEnum,
    id?: string,
  ) {
    if (id) {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new HttpException(
          `Product with id ${id} was not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return product;
    }

    const where = category ? { category } : {};

    if (!page && !limit) {
      return await this.prisma.product.findMany({
        where,
        orderBy: {
          intro: 'desc',
        },
      });
    }

    if (!page || !limit) {
      throw new HttpException(
        'Page and Limit must be provided together',
        HttpStatus.BAD_REQUEST,
      );
    }

    const skip = (page - 1) * limit;

    return await this.prisma.product.findMany({
      take: limit,
      skip,
      where,
      orderBy: {
        intro: 'desc',
      },
    });
  }
}
