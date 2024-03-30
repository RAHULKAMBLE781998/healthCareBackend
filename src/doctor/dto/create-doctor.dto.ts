import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  contactDetails: string;

  @IsNotEmpty()
  @IsString()
  availability: string;
}
