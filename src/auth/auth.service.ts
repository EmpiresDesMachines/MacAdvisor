import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { comparePassword } from './utils/comparePassword';
import { genUserName } from './utils/genUserName';

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

      username ??= genUserName();

      const user = {
        email,
        password: hashedPassword,
        username,
      };

      return await this.userService.createUser(user);
    } catch (error) {
      console.error('Error in register', error);
      throw new HttpException('User Already Exists', HttpStatus.CONFLICT);
    }
  }
  async login({ email, password }: LoginDto) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        throw new HttpException('Wrong Credentials', HttpStatus.BAD_REQUEST);
      }

      const token = sign(
        { userId: user.id },
        this.configService.get<string>('SECRET') as string,
      );

      return { token };
    } catch (error) {
      console.error('Error in login', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
