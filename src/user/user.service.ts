import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './types/user.interface';
import { changeProfileDto } from './dto/change-profile.dto';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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
      if (data.email) {
        const existingEmail = await this.prisma.user.findFirst({
          where: {
            AND: [{ email: data.email }, { NOT: { id } }],
          },
        });
        if (existingEmail) {
          throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
        }
      }
      if (data.username) {
        const existingUsername = await this.prisma.user.findFirst({
          where: {
            AND: [{ username: data.username }, { NOT: { id } }],
          },
        });
        if (existingUsername) {
          throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
        }
      }

      let token: string | undefined = undefined;

      if (data.password) {
        const hashedPassword = await hash(data.password, 10);
        data.password = hashedPassword;

        token = sign(
          { userId: id },
          this.configService.get<string>('SECRET') as string,
        );
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      const { password, ...safeUser } = updatedUser;

      return token ? { user: safeUser, token } : { user: safeUser };
    } catch (error) {
      console.log('changeUserProfile error', error);
      throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUserProfile(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.log('deleteUserProfile error', error);
      throw new HttpException('Internal server error', HttpStatus.BAD_REQUEST);
    }
  }
}
