import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Logger, Req } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AccessTokenGuard } from 'src/auth/guard';
import { AsyncLocalStorage } from 'async_hooks';

@Controller('patient')
@UseGuards(AccessTokenGuard)
export class PatientController {
  private readonly logger = new Logger(PatientController.name);
  constructor(
    private readonly patientService: PatientService,
    private readonly als: AsyncLocalStorage<any>
    ) {}

  @Post()
  create(@Body(new ValidationPipe()) createPatientDto: CreatePatientDto , @Req() req: Request ) {
    this.logger.log(`Request with correlation ID ${this.als.getStore()?.get('correlationId')} received on endpoint ${req.method} ${req.url}`);
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}
