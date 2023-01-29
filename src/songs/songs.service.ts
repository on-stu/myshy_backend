import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateSongDto } from './dtos/create-song.dto';
import { Song } from './entities/song.entity';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songs: Repository<Song>,
  ) {}

  async createSong(
    { title, description }: CreateSongDto,
    file: Express.Multer.File,
  ) {
    // create thumbnail of video
    await this.createThumbnail(file);
    const thumbnailPath = `uploads/thumbnails/thumbnail-${file.filename.replace(
      /\.[^/.]+$/,
      '',
    )}.png`;
    const newSong = this.songs.create({
      title,
      description,
      thumbnailUrl: thumbnailPath,
      videoUrl: file.path,
    });
    return await this.songs.save(newSong);
  }

  async getAll() {
    const songs = await this.songs.find();
    return songs;
  }

  async getOne(id: number) {
    const song = this.songs.findOne({
      where: { id },
      relations: ['comments', 'comments.user'],
    });

    return song;
  }

  async searchSongByTitle(title: string) {
    const songs = await this.songs.find({
      where: { title: Like(`%${title}%`) },
      relations: ['comments'],
    });
    return songs;
  }

  async deleteOne(id: number) {
    this.songs.delete(id);
    return true;
  }

  async createThumbnail(file: Express.Multer.File) {
    // create thumbnail of video
    let thumbsFilePath = '';
    let fileDuration = 0;

    // 비디오 전체 정보 추출
    ffmpeg.ffprobe(file.path, function (err, metadata) {
      fileDuration = metadata.format.duration;
    });

    //썸네일 생성, 비디오 길이 추출
    ffmpeg(file.path)
      .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '));
        thumbsFilePath = 'uploads/thumbnails/' + filenames[0];
      })
      .on('end', function () {
        console.log('Screenshots taken');
        return {
          success: true,
          thumbsFilePath: thumbsFilePath,
          fileDuration: fileDuration,
        };
      })
      .on('error', function (err) {
        console.error(err);
        return { success: false, err };
      })
      .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 1,
        folder: 'uploads/thumbnails',
        size: '320x200',
        // %b input basename ( filename w/o extension )
        filename: 'thumbnail-%b.png',
      });
  }

  async streamSong(id: number) {
    const song = await this.songs.findOne({ where: { id } });
    const songPath = song.videoUrl;
    return songPath;
  }
}
