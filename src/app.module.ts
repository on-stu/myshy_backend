import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entitiy';
import { Song } from './songs/entities/song.entity';

const HOST =
  process.env.NODE_ENV === 'development' ? 'minsu.info' : '127.0.0.1';

@Module({
  imports: [
    AuthModule,
    SongsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: HOST,
      port: 3306,
      username: 'root',
      password: 'tpwjdalstn1!',
      database: 'Myshy',
      entities: [User, Song],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
