import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { User } from './users/user.entity.js';

@Module({
  imports: [
    // 1. Configuración global para leer el archivo .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. Conexión a la base de datos PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true, // ¡Solo para desarrollo! Crea las tablas automáticamente
      }),
    }),
    
    // 3. Nuestros módulos
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}