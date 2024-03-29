import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Module({
    imports: [
      TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.getOrThrow('DB_HOST'),
          port: configService.getOrThrow('DB_PORT'),
          database: configService.getOrThrow('DB_DATABASE'),
          username: configService.getOrThrow('DB_USERNAME'),
          password: configService.getOrThrow('DB_PASSWORD'),
          autoLoadEntities: true,
          synchronize: Boolean(configService.getOrThrow('DB_SYNCHRONIZE')),
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([Patient, User]), 
    ],
  })
  export class DatabaseModule {
  }
