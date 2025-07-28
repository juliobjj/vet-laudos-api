import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1753462099413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR NOT NULL,
            cpf VARCHAR(11) NOT NULL,
            date_birth DATE NOT NULL,
            phone VARCHAR(20) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX idx_users_cpf ON users (cpf);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
