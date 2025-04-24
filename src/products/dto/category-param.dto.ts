import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '../types/category.enum';

export class CategoryParamDto {
  @IsOptional()
  @IsEnum(CategoryEnum, { message: 'Category not found' })
  category?: string;
  @IsOptional()
  @IsString()
  id?: string;
}
