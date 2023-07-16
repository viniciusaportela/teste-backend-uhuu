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
  @ApiProperty({ example: 'Example Title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'This is a description for the task',
  })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: Date })
  conclusionDate: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  createdBy?: Types.ObjectId;
}
