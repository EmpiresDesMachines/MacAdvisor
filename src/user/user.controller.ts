import { Body, Controller, Delete, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { getProfileDto } from './dto/get-profile.dto';
import { ExpressRequestInterface } from 'src/middlewares/types/expressRequest.interface';
import { changeProfileDto } from './dto/change-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getUserProfile(@Req() req: ExpressRequestInterface) {
    const user = req.user as getProfileDto;
    return user;
  }

  @Patch('profile')
  async changeUserProfile(
    @Body() body: changeProfileDto,
    @Req() req: ExpressRequestInterface,
  ) {
    const id = (req.user as getProfileDto).id;
    return await this.userService.changeUserProfile(id, body);
  }

  @Delete('profile')
  async deleteUserProfile(@Req() req: ExpressRequestInterface) {
    const id = (req.user as getProfileDto).id;
    return await this.userService.deleteUserProfile(id);
  }
}
