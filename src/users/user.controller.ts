import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserId } from '../utils/decorators/user-id.decorator';
import { AuthDto } from './dtos/auth.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';

// TODO add swagger
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createDto: CreateUserDto) {
    return this.service.create(createDto);
  }

  @Post('auth')
  auth(@Body() authDto: AuthDto) {
    return this.service.auth(authDto);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@UserId() userId: string, @Body() updateDto: UpdateUserDto) {
    return this.service.update(userId, updateDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  deleteMe(@UserId() userId: string) {
    return this.service.delete(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() userId: string) {
    return this.service.findById(userId);
  }
}
