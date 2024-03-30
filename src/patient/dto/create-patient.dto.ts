import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  contactDetails: string;
}