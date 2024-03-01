import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  @Get()
  public async getUserList(): Promise<void> {
    return;
  }

  @Post('find-by-username-and-password')
  async findUserByUsernameAndPassword(
    @Body() user: Partial<User>,
  ): Promise<User | null> {
    const { username, password } = user;
    const foundUser = await this.usersRepository.findOne({
      where: { username, password },
    });
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }

  @Post()
  public async createUser(@Body() user: Partial<User>): Promise<User> {
    if (!user.username) {
      throw new BadRequestException('Missing required fields');
    }
    return this.usersRepository.save(user);
  }
}
