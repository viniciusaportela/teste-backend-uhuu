import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Your Name' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: '1234' })
  password: string;
}
