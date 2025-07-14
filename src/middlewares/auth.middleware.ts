import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ExpressRequestInterface } from './types/expressRequest.interface';
import { JwtPayload } from './types/JwtPayload.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private async findSafeUserForAuthById(id: string) {
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

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const secret = this.configService.getOrThrow<string>('SECRET');

    try {
      const decoded = verify(token, secret) as JwtPayload;
      const user = await this.findSafeUserForAuthById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      req.user = user;
      next();
      return;
    } catch (error) {
      this.logger.error('Invalid JWT Token', error);
      return next(new UnauthorizedException('Invalid token'));
    }
  }
}
