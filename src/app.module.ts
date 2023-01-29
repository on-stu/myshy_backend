import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entitiy';
import { Song } from './songs/entities/song.entity';
import { Comment } from './songs/entities/comment.entity';

const HOST =
  process.env.NODE_ENV === 'development' ? 'minsu.info' : 'localhost';

// changed

@Module({
  imports: [
    AuthModule,
    SongsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: HOST,
      port: 3306,
      username: 'root',
      password: 'tpwjdalstn1!',
      database: 'Myshy',
      entities: [User, Song, Comment],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
