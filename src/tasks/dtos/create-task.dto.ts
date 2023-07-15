import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  conclusionDate: Date;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  createdBy: Types.ObjectId;
}
