import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserDto } from './user.dto';
import { UserEntity } from '../db/entities/user-entity';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() dto: UserDto): Promise<UserEntity> {
    return await this.usersService.create(dto);
  }
}
