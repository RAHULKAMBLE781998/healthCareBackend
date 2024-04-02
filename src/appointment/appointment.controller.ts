import { Body, Controller, Get, Logger, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ParseDatePipe } from 'src/common/pipes/date.pipe';
import { AccessTokenGuard } from 'src/auth/guard';
import { AsyncLocalStorage } from 'async_hooks';

@Controller('appointments')
//@UseGuards(AccessTokenGuard)
export class AppointmentController {
  private readonly logger = new Logger(AppointmentController.name);
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly als: AsyncLocalStorage<any>
    ) {}

  @Post()
  async createAppointment(
    @Body('patientId') patientId: string,
    @Body('doctorId') doctorId: string,
    @Body('dateTime', ParseDatePipe) dateTime: Date,
    @Req() req: Request 
  ) {
    this.logger.log(`Request with correlation ID ${this.als.getStore()?.get('correlationId')} received on endpoint ${req.url}`);
    return this.appointmentService.bookAppointment(
      patientId,
      doctorId,
      dateTime,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto.dateTime);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.appointmentService.cancelAppointment(id);
  }

  @Get('doctor/:doctorId/date/:date')
  async getAppointmentsForDoctorOnDate(
    @Param('doctorId') doctorId: string,
    @Param('date', ParseDatePipe) date: Date,
  ) {
    return this.appointmentService.getAppointmentsForDoctorOnDate(doctorId, date);
  }

  @Get('doctor/:doctorId/date/:date/available-slots')
  async getAvailableTimeSlotsForDoctor(
    @Param('doctorId') doctorId: string,
    @Param('date', ParseDatePipe) date: Date,
  ) {
    return this.appointmentService.findAvailableTimeSlotsForDoctor(doctorId, date);
  }
}

