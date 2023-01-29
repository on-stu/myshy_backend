import { ApiProperty } from '@nestjs/swagger';
export class CreateSongDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty()
  description: string;
}
