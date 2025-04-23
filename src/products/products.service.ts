import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async getProducts({ page, limit }: GetProductsDto = {}) {
    if (!page && !limit) {
      return await this.prisma.product.findMany({
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
      orderBy: {
        intro: 'desc',
      },
    });
  }
}
