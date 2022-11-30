import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CreateSongDto } from './dtos/create-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async getSongs() {
    return await this.songsService.getAll();
  }

  @Post()
  async createSong(@Body() createSongDto: CreateSongDto) {
    return await this.songsService.create(createSongDto);
  }

  @Get(':id')
  async getSong(@Param() param) {
    return this.songsService.getOne(param.id);
  }

  @Delete(':id')
  async deleteSong(@Param() param) {
    return this.songsService.deleteOne(param.id);
  }
}
