import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllTasksFromUserDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({ enum: TaskStatus, required: false })
  status: TaskStatus;
}
