import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { AlsMiddleware } from 'src/als/als.middleware';
import { AlsModule } from 'src/als/als.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]) , 
    DoctorModule ,
    PatientModule ,
    AlsModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
