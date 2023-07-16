import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResDto {
  @ApiProperty({ example: 'Example Title' })
  title: string;

  @ApiProperty({
    example: 'This is a description for the task',
  })
  description: string;

  @ApiProperty()
  conclusionDate: Date;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ example: '64b36320f3472c5f73f18106' })
  createdBy: string;
}
