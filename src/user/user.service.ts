import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/db/entities/user-entity';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: UserDto): Promise<UserEntity> {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('E-mail já cadastrado.');

    const cpfExists = await this.userRepository.findOne({
      where: { cpf: dto.cpf },
    });
    if (cpfExists) throw new BadRequestException('CPF já cadastrado.');

    const hashedPassword: string = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      passwordHash: hashedPassword,
    });

    return this.userRepository.save(user);
  }
}
