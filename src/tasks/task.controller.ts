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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorMessage } from '../utils/enums/error-message.enum';
import { TaskResDto } from './dtos/task-res.dto';

@ApiBearerAuth()
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Successfully created user task',
    type: TaskResDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidInput,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiOperation({ summary: 'Create a new task' })
  @UseGuards(JwtAuthGuard)
  create(@UserId() userId: string, @Body() createDto: CreateTaskDto) {
    createDto.createdBy = new Types.ObjectId(userId);
    return this.service.create(createDto);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user task',
    type: TaskResDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidInput,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.TaskNotFound,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessage.TryingToUseResourceFromAnotherUser,
  })
  @ApiOperation({ summary: 'Update a task that you own' })
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() updateDto: UpdateTaskDto,
  ) {
    return this.service.update({ id, userId }, updateDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted user task',
    type: TaskResDto,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.TaskNotFound,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessage.TryingToUseResourceFromAnotherUser,
  })
  @ApiOperation({ summary: 'Delete a task that you own' })
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @UserId() userId: string) {
    return this.service.delete({ id, userId });
  }

  @Get('/me')
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved user's tasks",
    type: [TaskResDto],
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all tasks that you own' })
  findAllFromUser(
    @UserId() userId: string,
    @Query() filterDto: FindAllTasksFromUserDto,
  ) {
    return this.service.findAllFromUser(userId, filterDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved given task',
    type: TaskResDto,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.TaskNotFound,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessage.NotAuthenticated,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessage.TryingToUseResourceFromAnotherUser,
  })
  @ApiOperation({ summary: 'Retrieve one task that you own' })
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string, @UserId() userId: string) {
    return this.service.findById({ id, userId });
  }
}
