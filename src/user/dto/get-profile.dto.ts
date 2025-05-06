import { IsDate, IsEmail, IsUUID } from 'class-validator';

export class getProfileDto {
  @IsUUID()
  id: string;
  @IsEmail()
  email: string;
  username: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
