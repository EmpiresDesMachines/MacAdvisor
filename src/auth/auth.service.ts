import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register({ email, password, username }: RegisterDto) {
    try {
      email = email.trim().toLowerCase();

      const hashedPassword = await hash(password, 10);

      username ??= `user_${new Date().getTime()}`;

      const user = {
        email,
        password: hashedPassword,
        username,
      };

      return await this.userService.createUser(user);
    } catch (error) {
      console.error('Error in register');
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
      }

      const validPassword = await compare(password, user.password);
      if (!validPassword) {
        throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
      }

      // обернуть в функцию generateJwt
      // First param in sign
      // добавить гуард
      // добавить мидлвару
      // добавить /profile
      const token = sign(
        { userId: user.id },
        this.configService.get<string>('SECRET') as string,
      );

      return { token };
    } catch (error) {
      console.error('Error in login');
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
