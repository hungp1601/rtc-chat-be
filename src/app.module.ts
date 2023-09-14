import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { createConnection } from 'mysql2/promise';
// import { CorsModule } from '@nestjs/platform-express';
// Entities
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';

const entities = [User];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: entities,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;
  static baseUrl: string;
  static isDev: boolean;

  async createDatabaseIfNotExists() {
    const connection = await createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
    );
    await connection.end();
  }

  constructor() {
    AppModule.port = process.env.PORT;
    AppModule.isDev = true;
    AppModule.baseUrl = process.env.BASE_URL;

    this.createDatabaseIfNotExists()
      .then(() => console.log('Database created or already exists.'))
      .catch((error) => console.error('Failed to create database:', error));
  }
}
