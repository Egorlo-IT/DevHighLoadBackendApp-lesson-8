import {
  Body,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserCreateDto } from '../dto/user-create.dto';
import { UsersEntity } from '../users.entity';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { HelperFileLoaderUser } from 'apps/api/src/utils/helperFileLoaderUser';
import { imageFileFilter } from 'apps/api/src/utils/imageFileFilter';
import { hash } from 'apps/api/src/utils/crypto';

const USER_PATH = '/user-static/';
const usersHelperFileLoader = new HelperFileLoaderUser();

@Controller('profile')
@ApiBearerAuth()
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('edit')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: usersHelperFileLoader.destinationPath,
        filename: usersHelperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiOperation({ summary: 'User profile edit' })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully edit',
    type: UsersEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async edit(
    @Request() req,
    @Body() user: UserCreateDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    try {
      const _userEntity = new UsersEntity();
      if (avatar?.filename) {
        _userEntity.avatar = USER_PATH + avatar.filename;
      }
      _userEntity.firstName = user.firstName;
      _userEntity.lastName = user.lastName;
      _userEntity.email = user.email;
      _userEntity.password = await hash(user.password);
      const result = await this.usersService.edit(_userEntity, req.user.id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
