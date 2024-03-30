import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async findOne(id: string): Promise<Patient> {
    const options: FindOneOptions<Patient> = { where: { id } };
    const patient = await this.patientRepository.findOne(options);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const options: FindOneOptions<Patient> = { where: { id } };
    const patient = await this.patientRepository.findOne(options);
    this.patientRepository.merge(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<Patient> = { where: { id } };
    const patient = await this.patientRepository.findOne(options);
    await this.patientRepository.remove(patient);
  }
}
