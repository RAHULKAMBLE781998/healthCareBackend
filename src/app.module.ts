import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { AlsModule } from './als/als.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    PatientModule,
    UserModule,
    AppointmentModule,
    DoctorModule,
    AlsModule,
    RedisModule],
  controllers: [],
  providers: [],
  exports: [RedisModule],
})
export class AppModule {}
