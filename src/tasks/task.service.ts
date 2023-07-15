import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskRepository } from './task.repository';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { ErrorMessage } from '../utils/enums/error-message.enum';
import { IIdentity } from './interfaces/identity.interface';
import { Task } from './task.schema';
import { FindAllTasksFromUserDto } from './dtos/list-tasks-from-user.dto';

@Injectable()
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async create(createDto: CreateTaskDto) {
    return this.repository.create(createDto);
  }

  async update(identity: IIdentity, updateDto: UpdateTaskDto) {
    const { id, userId } = identity;

    const task = await this.repository.findById(id);

    this.validateTask(task, userId);

    const editedTask = await this.repository.update(id, updateDto);

    if (!editedTask) {
      throw new NotFoundException(ErrorMessage.TaskNotFound);
    }

    return editedTask;
  }

  async delete(identity: IIdentity) {
    const { id, userId } = identity;

    const task = await this.repository.findById(id);

    this.validateTask(task, userId);

    await this.repository.delete(id);

    return task;
  }

  async deleteAllFromUser(userId: string) {
    return this.repository.deleteAllFromUser(userId);
  }

  async findAllFromUser(userId: string, filterDto: FindAllTasksFromUserDto) {
    return this.repository.findAllFromUser(userId, filterDto);
  }

  async findById(identity: IIdentity) {
    const { id, userId } = identity;

    const task = await this.repository.findById(id);

    this.validateTask(task, userId);

    return task;
  }

  private validateTask(task: Task, userId: string) {
    this.validateExistence(task);
    this.validatePermission(task, userId);
  }

  private validateExistence(task: Task) {
    if (!task) {
      throw new NotFoundException(ErrorMessage.TaskNotFound);
    }
  }

  private validatePermission(task: Task, userId: string) {
    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException(ErrorMessage.NotHavePermission);
    }
  }
}
