import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Comment } from 'src/songs/entities/comment.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends CoreEntity {
  @Unique(['email'])
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @OneToMany((type) => Comment, (comment) => comment.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.log(error);
    }
  }
}
