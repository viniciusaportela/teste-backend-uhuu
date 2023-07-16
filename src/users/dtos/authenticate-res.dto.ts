import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateResDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGIzNjEwMDdhMTBhZjgwZWIzMDVlYmQiLCJpYXQiOjE2ODk0NzczOTJ9.opalOn3G1HibQ62ZZ7-jRY7qeWFWn30fLUx52KQti2w',
  })
  token: string;
}
