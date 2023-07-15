import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from './enums/task-status.enum';
import { Types } from 'mongoose';
import { User } from '../users/user.schema';

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  conclusionDate: Date;

  @Prop({ enum: TaskStatus, default: TaskStatus.Open, required: true })
  status: TaskStatus;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
