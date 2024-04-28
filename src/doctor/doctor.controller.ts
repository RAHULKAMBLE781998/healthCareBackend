import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { AccessTokenGuard } from 'src/auth/guard';
import { ValidationPipe } from '@nestjs/common';
import { DebounceInterceptor } from 'src/redis/interceptors/debounce.interceptor';

@Controller('doctor')
@UseInterceptors(DebounceInterceptor)
@UseGuards(AccessTokenGuard)
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
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.doctorService.remove(id);
  }
}

