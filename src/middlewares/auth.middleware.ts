import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { ExpressRequestInterface } from './types/expressRequest.interface';
import { JwtPayload } from './types/JwtPayload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const secret = this.configService.get<string>('SECRET') as string;

    try {
      const decoded = verify(token, secret) as JwtPayload;
      const user = await this.userService.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      req.user = user;
      next();
      return;
    } catch (error) {
      return next(new UnauthorizedException('Invalid token'));
      //
      //req.user = null;
      //next()
      //return;
    }
  }
}
