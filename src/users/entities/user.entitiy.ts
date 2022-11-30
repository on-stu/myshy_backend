import { CoreEntity } from 'src/common/core.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User extends CoreEntity {
  @Column()
  email: string;
}
