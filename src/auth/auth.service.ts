import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { comparePassword } from './utils/comparePassword';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      return await this.userService.createUser(registerDto);
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
      }

      const token = sign(
        { userId: user.id },
        this.configService.getOrThrow<string>('SECRET'),
      );
      const { password: pass, ...safeUser } = user;
      return { token, user: safeUser };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
