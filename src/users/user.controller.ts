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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorMessage } from '../utils/enums/error-message.enum';
import { AuthenticateResDto } from './dtos/authenticate-res.dto';
import { UserResDto } from './dtos/user-res.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successfully created user',
    type: UserResDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidInput,
  })
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createDto: CreateUserDto) {
    return this.service.create(createDto);
  }

  @Post('auth')
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated. Returned the user token',
    type: AuthenticateResDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidInput,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.WrongCredentials,
  })
  @ApiOperation({
    summary:
      'Authenticate with email and password to receive a token used on authenticated routes (JWT)',
  })
  @HttpCode(200)
  auth(@Body() authDto: AuthDto) {
    return this.service.auth(authDto);
  }

  @Put('me')
  @ApiResponse({
    status: 200,
    description: 'Successfully updated your user',
    type: UserResDto,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiOperation({
    summary: 'Update your own user',
  })
  @UseGuards(JwtAuthGuard)
  updateMe(@UserId() userId: string, @Body() updateDto: UpdateUserDto) {
    return this.service.update(userId, updateDto);
  }

  @Delete('me')
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted your user',
    type: UserResDto,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiOperation({
    summary:
      'Delete your own user. After this operation, if using the same token all your following requests will fail',
  })
  @UseGuards(JwtAuthGuard)
  deleteMe(@UserId() userId: string) {
    return this.service.delete(userId);
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved your user',
    type: UserResDto,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiOperation({
    summary: 'Retrieve your own user.',
  })
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() userId: string) {
    return this.service.findById(userId);
  }
}
