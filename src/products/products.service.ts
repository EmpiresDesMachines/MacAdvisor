import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsDto } from './dto/get-products.dto';
import { CategoryEnum } from './types/category.enum';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(private readonly prisma: PrismaService) {}

  private getPaginationParams({ page = 1, limit = 10 }: GetProductsDto) {
    return {
      page,
      limit,
      skip: (page - 1) * limit,
    };
  }

  async getAllProducts(dto: GetProductsDto) {
    const productCount = await this.prisma.product.count();
    if (!productCount) {
      this.logger.error('Database is empty');
      throw new HttpException('No data was found', HttpStatus.NOT_FOUND);
    }
    const { page, limit, skip } = this.getPaginationParams(
      dto.page || dto.limit
        ? dto
        : {
            page: 1,
            limit: productCount,
          },
    );
    // const { page, limit, skip } = this.getPaginationParams({
    //   page: 1,
    //   limit: productCount,
    // });

    const data = await this.prisma.product.findMany({
      take: limit,
      skip,
      orderBy: {
        intro: 'desc',
      },
    });

    const totalPages = Math.ceil(productCount / limit);

    return {
      data,
      currentPage: page,
      totalPages,
      productCount,
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new HttpException(
        `Product with id ${id} was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  async getProductsByCategory(dto: GetProductsDto, category: CategoryEnum) {
    const { page, limit, skip } = this.getPaginationParams(dto);
    const where = { category };

    const productCount = await this.prisma.product.count({ where });
    if (!productCount) {
      throw new HttpException(
        `Product(s) with category ${category} was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const data = await this.prisma.product.findMany({
      take: limit,
      skip,
      where,
      orderBy: {
        intro: 'desc',
      },
    });

    const totalPages = Math.ceil(productCount / limit);

    return {
      data,
      currentPage: page,
      totalPages,
      productCount,
    };
  }
}
