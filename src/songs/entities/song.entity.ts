import { CoreEntity } from 'src/common/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Song extends CoreEntity {
  @Column()
  title: string;

  @Column()
  url: string;
}
