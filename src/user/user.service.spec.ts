import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user-entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: MockProxy<Repository<UserEntity>>;

  beforeEach(async () => {
    // Mock automático do repositório
    mockRepo = mock<Repository<UserEntity>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve criar um usuário com uma senha hash', async () => {
    const dto = {
      id: 1,
      email: 'teste@teste.com',
      password: '123456',
      name: 'João',
      cpf: '12345678900',
      dateBirth: new Date('2000-01-01'),
      phone: '11999999999',
    };

    const hashedPassword: string = await bcrypt.hash(dto.password, 10);

    // Mocks automáticos com tipos
    mockRepo.findOne.mockResolvedValue(null);
    // simula o retorno do método create
    mockRepo.create.mockReturnValue({
      ...dto,
      passwordHash: hashedPassword,
    } as unknown as UserEntity);
    mockRepo.save.mockResolvedValue({
      ...dto,
      passwordHash: hashedPassword,
    } as unknown as UserEntity);

    const result = await service.create(dto);

    expect(result).toMatchObject({
      id: dto.id,
      email: dto.email,
      name: dto.name,
      cpf: dto.cpf,
      dateBirth: dto.dateBirth,
      phone: dto.phone,
    });

    const saveSpy = jest.spyOn(mockRepo, 'save');
    expect(result.passwordHash).toBeDefined();
    expect(result.passwordHash).not.toBe(dto.password);

    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro ao tentar criar usuário com e-mail duplicado', async () => {
    const dto = {
      id: 1,
      email: 'emailduplicado@teste.com',
      password: '123456',
      name: 'Maria',
      cpf: '98765432100',
      dateBirth: new Date('1990-01-01'),
      phone: '11988888888',
    };

    // Simula e-mail já existente
    mockRepo.findOne.mockResolvedValue({
      email: dto.email,
    } as Partial<UserEntity> as UserEntity);

    await expect(service.create(dto)).rejects.toThrow('E-mail já cadastrado');

    const findOneSpy = jest.spyOn(mockRepo, 'findOne');
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: dto.email },
    });

    const saveSpy = jest.spyOn(mockRepo, 'save');
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('deve lançar erro ao tentar criar usuário com CPF duplicado', async () => {
    const dto = {
      id: 1,
      email: 'cpfduplicado@teste.com',
      password: '123456',
      name: 'Maria',
      cpf: '98765432102',
      dateBirth: new Date('1990-01-01'),
      phone: '11988888888',
    };

    const existingUser = {
      id: 1,
      email: 'dto.email',
      password: '123456',
      name: 'João',
      cpf: dto.cpf,
      dateBirth: new Date('1985-02-02'),
      phone: '11977776666',
    };

    // Simula cpf já existente
    mockRepo.findOne
      .mockResolvedValueOnce(null) // Primeiro findOne para email
      .mockResolvedValueOnce({
        existingUser,
      } as Partial<UserEntity> as UserEntity); // Segundo findOne para cpf

    await expect(service.create(dto)).rejects.toThrow('CPF já cadastrado.');

    const findOneSpy = jest.spyOn(mockRepo, 'findOne');
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
    expect(findOneSpy).toHaveBeenCalledWith({ where: { cpf: dto.cpf } });
    expect(findOneSpy).toHaveBeenCalledTimes(2);
  });
});
