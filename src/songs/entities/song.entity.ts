import { CoreEntity } from 'src/common/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Song extends CoreEntity {
  @Column()
  title: string;

  @Column()
  videoUrl: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  views: number;

  @OneToMany((type) => Comment, (comment) => comment.song)
  comments: Comment[];

  @Column({ default: 0 })
  loves: number;

  @Column({ default: 0 })
  mindBlowns: number;

  @Column({ default: 0 })
  fires: number;
}
