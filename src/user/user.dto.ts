import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class UserDto {
  id: number;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @Length(8, 255, { message: 'A senha deve ter entre 8 e 255 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'A senha deve conter ao menos 1 letra maiúscula, 1 minúscula e 1 número',
  })
  password: string;

  @Length(3, 255)
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  name: string;

  @Length(11, 11)
  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  cpf: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória.' })
  dateBirth: Date;

  @Length(8, 20)
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  phone: string;

  @IsDateString()
  createdAt?: Date;

  @IsDateString()
  updatedAt?: Date;
}
