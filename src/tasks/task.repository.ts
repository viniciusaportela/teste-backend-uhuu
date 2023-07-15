import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { FindAllTasksFromUserDto } from './dtos/list-tasks-from-user.dto';
import { User } from '../users/user.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private readonly model: Model<Task>) {}

  async create(createDto: CreateTaskDto) {
    const createdTask = await this.model.create(createDto);
    return createdTask.toObject();
  }

  update(id: string, updateDto: UpdateTaskDto) {
    return this.model
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: updateDto },
        { new: true },
      )
      .lean()
      .exec();
  }

  delete(id: string) {
    return this.model
      .findOneAndDelete({ _id: new Types.ObjectId(id) })
      .lean()
      .exec();
  }

  deleteAllFromUser(userId: string) {
    return this.model
      .deleteMany({ createdBy: new Types.ObjectId(userId) })
      .lean()
      .exec();
  }

  findById(id: string) {
    return this.model.findById(id).lean().exec();
  }

  findAllFromUser(userId: string, filterDto: FindAllTasksFromUserDto) {
    const query: FilterQuery<User> = {
      createdBy: new Types.ObjectId(userId),
    };

    if (filterDto.status) {
      query.status = filterDto.status;
    }

    return this.model.find(query).lean().exec();
  }
}
