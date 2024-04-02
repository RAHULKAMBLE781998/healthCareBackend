import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlsMiddleware } from 'src/als/als.middleware';
import { AlsModule } from 'src/als/als.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]),AlsModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService]
})
export class DoctorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
