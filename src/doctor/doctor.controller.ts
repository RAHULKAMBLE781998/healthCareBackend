import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { AccessTokenGuard } from 'src/auth/guard';
import { ValidationPipe } from '@nestjs/common';

@Controller('doctor')
//@UseGuards(AccessTokenGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body(new ValidationPipe()) createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @Get('name/:name')
  findByname(@Param('name') name: string): Promise<Doctor[]> {
    return this.doctorService.findByname(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.doctorService.remove(id);
  }
}
function UsePipes(arg0: ValidationPipe, arg1: any): (target: DoctorController, propertyKey: "create", descriptor: TypedPropertyDescriptor<(createDoctorDto: CreateDoctorDto) => Promise<Doctor>>) => void | TypedPropertyDescriptor<(createDoctorDto: CreateDoctorDto) => Promise<Doctor>> {
  throw new Error('Function not implemented.');
}

