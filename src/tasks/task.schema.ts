import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from './enums/task-status.enum';
import { Types } from 'mongoose';
import { User } from '../users/user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop({ required: true })
  @ApiProperty()
  conclusionDate: Date;

  @Prop({ enum: TaskStatus, default: TaskStatus.Open, required: true })
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  @ApiProperty({ type: String })
  createdBy: Types.ObjectId;

  @Prop({ select: false })
  __v: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
