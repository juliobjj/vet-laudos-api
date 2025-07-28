import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { UserDto } from './user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UsersService>(UsersService);
  });

  it('deve retornar o usuário criado', async () => {
    const dto = {
      id: 1,
      email: 'cpfduplicado@teste.com',
      password: '123456',
      name: 'Maria',
      cpf: '98765432102',
      dateBirth: new Date('1990-01-01'),
      phone: '11988888888',
    };
    const createdUser = { ...dto };

    (service.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await controller.create(dto);

    const createSpy = jest.spyOn(service, 'create');
    expect(createSpy).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdUser);
  });

  it('deve lançar BadRequestException para e-mail duplicado', async () => {
    const dto = { email: 'duplicado@teste.com', password: '123456' };

    (service.create as jest.Mock).mockRejectedValue(
      new BadRequestException('E-mail já cadastrado.'),
    );

    await expect(
      controller.create(dto as Partial<UserDto> as UserDto),
    ).rejects.toThrow(BadRequestException);
    const createSpy = jest.spyOn(service, 'create');
    expect(createSpy).toHaveBeenCalledWith(dto as Partial<UserDto> as UserDto);
  });

  it('deve lançar BadRequestException para CPF duplicado', async () => {
    const dto = {
      email: 'cpf@teste.com',
      password: '123456',
      cpf: '12345678900',
    };

    (service.create as jest.Mock).mockRejectedValue(
      new BadRequestException('CPF já cadastrado.'),
    );

    await expect(
      controller.create(dto as Partial<UserDto> as UserDto),
    ).rejects.toThrow(BadRequestException);

    const createSpy = jest.spyOn(service, 'create');
    expect(createSpy).toHaveBeenCalledWith(dto as Partial<UserDto> as UserDto);
  });
});
