import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: 'Example Title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'This is a description for the task',
  })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  conclusionDate: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({ enum: TaskStatus, required: false })
  status: TaskStatus;
}
