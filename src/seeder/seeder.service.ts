import {
  Injectable,
  OnModuleInit,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { DeviceData } from './types/deviceData.interface';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    await this.fillProductTable();
  }

  async fillProductTable() {
    const hasProduct = await this.prisma.product.findFirst();
    if (hasProduct) {
      return;
    }
    const data = await this.loadData();
    await this.prisma.product.createMany({ data });
  }

  async loadData() {
    try {
      const filePath = join(__dirname, 'data', 'initial-data.json');
      if (!existsSync(filePath)) {
        this.logger.error('initial-data.json not found');
        throw new HttpException(
          'initial-data.json not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const fileContent = await readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent) as DeviceData[];
      return data;
    } catch (error) {
      const msg = 'Failed to load initial data';
      this.logger.error(msg);
      throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
