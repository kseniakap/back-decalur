import { Controller, HttpCode, Put, Get,Patch, Body, Param,  UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //get profile 
  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser("id") id: number ){
    return this.userService.byId(id)
  }

   //update profile
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async getNewTokens(@CurrentUser("id") id: number, @Body() dto: UserDto ){
    return this.userService.updateProfile(id, dto)
  }

  //toggle favorites
  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser("id") id: number,
    @Param("productId") productId:string, 
     ){
    return this.userService.toggleFavorite(id, +productId)
  }
}
