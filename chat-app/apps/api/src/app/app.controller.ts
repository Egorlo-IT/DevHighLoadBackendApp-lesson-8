import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
@ApiBearerAuth()
@ApiTags('Security and other')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get welcome message from API' })
  @ApiResponse({
    status: 200,
    description: 'API is running successfully',
    type: Response,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  getData() {
    return this.appService.getData();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Get auth/login' })
  @ApiResponse({
    status: 200,
    description: 'Authorization successful',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async login(@Request() req) {
    const access_token = await this.authService.login(req.user);
    return access_token;
  }

  @Post('auth/logout')
  @ApiOperation({ summary: 'Get auth/logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout completed successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async logout() {
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/user')
  @ApiOperation({ summary: 'Get auth/user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully received',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  getProfile(@Request() req) {
    const user = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      roles: req.user.roles,
      avatar: req?.user?.avatar,
    };
    return user;
  }
}
