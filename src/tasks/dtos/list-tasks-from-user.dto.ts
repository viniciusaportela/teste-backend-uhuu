import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class FindAllTasksFromUserDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
