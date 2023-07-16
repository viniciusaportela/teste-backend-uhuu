import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  conclusionDate: Date;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  createdBy: Types.ObjectId;
}
