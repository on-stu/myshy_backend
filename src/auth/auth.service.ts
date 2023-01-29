import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entitiy';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new ForbiddenException('User not found');
    if ((await user).checkPassword(loginDto.password)) {
      const jwt = this.jwtService.sign(
        { id: (await user).id },
        { secret: jwtConstants.secret },
      );
      return { access_token: jwt, user };
    } else {
      throw new ForbiddenException('Invalid password');
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (user) throw new ForbiddenException('User already exists');
    const newUser = this.usersRepository.create(registerDto);
    await this.usersRepository.save(newUser);
    const jwt = this.jwtService.sign(
      { id: newUser.id },
      { secret: jwtConstants.secret },
    );
    return { access_token: jwt, user: newUser };
  }
}
