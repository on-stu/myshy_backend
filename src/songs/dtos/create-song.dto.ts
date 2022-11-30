import { ApiProperty } from '@nestjs/swagger';
export class CreateSongDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;
}
