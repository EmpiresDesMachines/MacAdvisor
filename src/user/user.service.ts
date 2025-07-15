import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './types/user.interface';
import { changeProfileDto } from './dto/change-profile.dto';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { genUserName } from 'src/auth/utils/genUserName';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByLogin(login: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
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

  async createUser(user: User) {
    try {
      if (!user.username) {
        user.username = genUserName();
      }

      const hasUser = await this.userExsists(user.email, user.username);

      if (hasUser) {
        this.logger.error('The user already exists');
      }

      const hashedPassword = await hash(user.password, 10);
      user.password = hashedPassword;

      const newUser = await this.prisma.user.create({
        data: user,
      });

      // user without password
      const { password, ...publicUser } = newUser;

      return publicUser;
    } catch (error) {
      this.logger.error('Error in register', error);
      throw error;
    }
  }

  async deleteUserProfile(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return { success: true, message: `User ${id} was deleted successfully` };
  }

  async changeUserProfile(id: string, data: changeProfileDto) {
    const updateData = { ...data };
    let token: string | undefined;

    if (data.password) {
      const hashedPassword = await hash(data.password, 10);
      updateData.password = hashedPassword;

      token = sign(
        { userId: id },
        this.configService.getOrThrow<string>('SECRET'),
      );
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...safeUser } = updatedUser;

    return token ? { user: safeUser, token } : { user: safeUser };
  }
}
