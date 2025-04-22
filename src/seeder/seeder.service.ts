import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { DeviceData } from './types/deviceData.interface';

@Injectable()
export class SeederService implements OnModuleInit {
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
    //console.log(await this.loadData());
    await this.prisma.product.createMany({ data });
  }

  async loadData() {
    try {
      //const filePath = './src/seeder/data/initial-data.json';
      const filePath = join(process.cwd(), 'src/seeder/data/initial-data.json');
      const fileContent = await readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent) as DeviceData[];
      return data;
    } catch (error) {
      console.error('Ошибка при чтении JSON:', error);
      throw error;
    }
  }
}
