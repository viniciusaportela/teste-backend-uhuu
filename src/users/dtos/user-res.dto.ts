import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserResDto {
  @ApiProperty({ type: String, example: '64b36077b2d06eaffea522a5' })
  _id: Types.ObjectId;

  @ApiProperty({ example: 'Your Name' })
  name: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
