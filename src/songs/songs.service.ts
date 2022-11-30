import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongDto } from './dtos/create-song.dto';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songs: Repository<Song>,
  ) {}

  async create({ title, url }: CreateSongDto) {
    const newSong = this.songs.create({ title, url });
    return await this.songs.save(newSong);
  }

  async getAll() {
    const songs = await this.songs.find();
    return songs;
  }

  async getOne(id: number) {
    const song = this.songs.findOne({ where: { id } });
    return song;
  }

  async deleteOne(id: number) {
    this.songs.delete(id);
    return true;
  }
}
