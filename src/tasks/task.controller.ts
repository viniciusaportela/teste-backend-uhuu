import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../utils/decorators/user-id.decorator';
import { Types } from 'mongoose';
import { FindAllTasksFromUserDto } from './dtos/list-tasks-from-user.dto';

// TODO add swagger
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@UserId() userId: string, @Body() createDto: CreateTaskDto) {
    createDto.createdBy = new Types.ObjectId(userId);
    return this.service.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() updateDto: UpdateTaskDto,
  ) {
    return this.service.update({ id, userId }, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @UserId() userId: string) {
    return this.service.delete({ id, userId });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  findAllFromUser(
    @UserId() userId: string,
    @Query() filterDto: FindAllTasksFromUserDto,
  ) {
    return this.service.findAllFromUser(userId, filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string, @UserId() userId: string) {
    return this.service.findById({ id, userId });
  }
}
