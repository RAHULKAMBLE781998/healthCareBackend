import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot(), // Load TypeORM config from ormconfig.json
        TypeOrmModule.forFeature([Patient]), // Register your entities
      ],
  })
export class DatabaseModule {}
