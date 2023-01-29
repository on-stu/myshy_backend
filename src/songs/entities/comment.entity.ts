import { CoreEntity } from 'src/common/core.entity';
import { User } from 'src/users/entities/user.entitiy';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from './song.entity';

@Entity()
export class Comment extends CoreEntity {
  @Column()
  text: string;

  @ManyToOne((type) => Song, (song) => song.comments)
  song: Song;

  @ManyToOne((type) => User, (user) => user.comments)
  user: User;
}
