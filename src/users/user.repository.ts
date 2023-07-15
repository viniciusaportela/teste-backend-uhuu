import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async create(createDto: CreateUserDto) {
    const createdUser = await this.model.create(createDto);
    return createdUser.toObject({ useProjection: true });
  }

  update(id: string, updateDto: UpdateUserDto) {
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

  findById(id: string) {
    return this.model.findById(id).lean().exec();
  }

  findByEmailWithPassword(email: string) {
    return this.model.findOne({ email }).select('+password').lean().exec();
  }
}
