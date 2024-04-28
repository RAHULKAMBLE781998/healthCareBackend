import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { Between, FindOneOptions, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
@Injectable()
export class AppointmentService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) { }

  async bookAppointment(
    patientId: string,
    doctorId: string,
    dateTime: Date,
  ): Promise<Appointment> {
    try {
      const patient = await this.patientService.findOne(patientId);
      const doctor = await this.doctorService.findOne(doctorId);

      const appointment = this.appointmentRepository.create({
        patient,
        doctor,
        dateTime,
        status: 'Scheduled',
      });

      await this.appointmentRepository.save(appointment);
      return appointment; 
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL error code for unique constraint violation
        throw new ConflictException('Appointment time slot is already booked. Please choose a different time.');
      }
    }
  }

  async updateAppointment(
    appointmentId: string,
    dateTime: Date,
  ): Promise<Appointment> {
    try {
      const appointment = await this.findOne(appointmentId);
      appointment.dateTime = dateTime;
      return this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL error code for unique constraint violation
        throw new ConflictException('Appointment time slot is already booked. Please choose a different time.');
      }
    }
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    const appointment = await this.findOne(appointmentId);
    appointment.status = 'Cancelled';
    await this.appointmentRepository.save(appointment);
  }

  async getAppointmentsForDoctorOnDate(
    doctorId: string,
    date: Date,
  ): Promise<Appointment[]> {
    const doctor = await this.doctorService.findOne(doctorId);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return this.appointmentRepository.find({
      where: {
        doctor,
        dateTime: Between(startOfDay, endOfDay),
      },
    });
  }

  async getAppointmentsByPatientOnDate(
    patientId: string,
    date: Date,
  ): Promise<Appointment[]> {
    const patient = await this.patientService.findOne(patientId);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return this.appointmentRepository.find({
      where: {
        patient,
        dateTime: Between(startOfDay, endOfDay),
      },
    });
  }

  async findAvailableTimeSlotsForDoctor(
    doctorId: string,
    date: Date,
  ): Promise<Date[]> {
    const doctor = await this.doctorService.findOne(doctorId);
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        doctor,
        dateTime: Between(new Date(date.getFullYear(), date.getMonth(), date.getDate()), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)),
      },
    });

    // Assuming doctor availability format is '9AM-5PM', convert it to startTime and endTime
    const availability = doctor.availability.split('-');
    const startTimeParts = availability[0].match(/^(\d+)(?::(\d+))?([ap]m)?$/i);
    const endTimeParts = availability[1].match(/^(\d+)(?::(\d+))?([ap]m)?$/i);

    if (!startTimeParts || !endTimeParts) {
      throw new Error('Invalid availability format');
    }

    const startTime = parseInt(startTimeParts[1]);
    const endTime = parseInt(endTimeParts[1]);

    // Generate time slots for the given date
    const timeSlots = [];
    for (let hour = startTime; hour < endTime; hour++) {
      timeSlots.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0));
    }

    // Filter out existing appointments
    const availableTimeSlots = timeSlots.filter(slot =>
      !existingAppointments.some(appointment => appointment.dateTime.getHours() === slot.getHours())
    );

    return availableTimeSlots;
  }


  async findOne(id: string): Promise<Appointment> {
    const options: FindOneOptions<Appointment> = { where: { id } };
    const appointment = await this.appointmentRepository.findOne(options);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }
}
