import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { createReadStream, statSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { CreateSongDto } from './dtos/create-song.dto';
import { SongsService } from './songs.service';
import { Headers } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async getSongs() {
    return await this.songsService.getAll();
  }

  // post with video file
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateSongDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async createSong(
    @Body() createSongDto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<any> {
    req.connection.setTimeout(1000 * 60 * 60 * 24);
    return this.songsService.createSong(createSongDto, file);
  }

  @Get('search/:title')
  async searchSong(@Param('title') title: string) {
    return this.songsService.searchSongByTitle(title);
  }

  @Get('stream/:id')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getStreamVideo(
    @Param('id') id: string,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const song = await this.songsService.getOne(parseInt(id));

    const videoPath = join(__dirname, '../../dist/', song.videoUrl);
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
    }
  }

  @Get(':id')
  async getSong(@Param('id') id: number) {
    return this.songsService.getOne(id);
  }

  @Delete(':id')
  async deleteSong(@Param() param) {
    return this.songsService.deleteOne(param.id);
  }
}
