import { Transform } from 'class-transformer';
import { IsNotEmpty , IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @IsNotEmpty()
  @IsUUID()
  doctorId: string;
  
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  dateTime: Date;
}
