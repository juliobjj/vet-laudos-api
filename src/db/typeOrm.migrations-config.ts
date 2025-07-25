import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './entities/user-entity';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: configService.get<number>('DB_PORT') || 5432,
  username: configService.get<string>('DB_USERNAME') || 'postgres',
  password: configService.get<string>('DB_PASSWORD') || '12345678',
  database: configService.get<string>('DB_DATABASE') || 'vet-laudos-api-db',
  entities: [UserEntity],
  migrations: [__dirname + '/migrations/**'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
