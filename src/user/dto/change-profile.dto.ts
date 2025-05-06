import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/auth/dto/register.dto';

export class changeProfileDto extends PartialType(RegisterDto) {}
