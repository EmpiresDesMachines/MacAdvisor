import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './types/user.interface';
import { changeProfileDto } from './dto/change-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: User) {
    try {
      const hasUser = await this.userExsists(user.email, user.username);
      if (hasUser) {
        throw new HttpException('The user already exists', HttpStatus.CONFLICT);
      }

      const newUser = await this.prisma.user.create({
        data: user,
      });

      const { password, ...publicUser } = newUser;

      return publicUser;
    } catch (error) {
      console.error('Error in register', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async userExsists(email: string, username: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async changeUserProfile(id: string, data: changeProfileDto) {
    try {
      return this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.log('changeUserProfile error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserProfile(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.log('deleteUserProfile error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
