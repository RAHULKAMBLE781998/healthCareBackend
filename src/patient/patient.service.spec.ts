import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';

describe('PatientService', () => {
  let service: PatientService;
  let patientRepositoryMock: any;

  beforeEach(async () => {
    patientRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useValue: patientRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const createPatientDto = { name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' };
      const savedPatient = { id: '1', ...createPatientDto };
      
      patientRepositoryMock.create.mockReturnValue(savedPatient);
      patientRepositoryMock.save.mockResolvedValue(savedPatient);

      const result = await service.create(createPatientDto);

      expect(result).toEqual(savedPatient);
      expect(patientRepositoryMock.create).toHaveBeenCalledWith(createPatientDto);
      expect(patientRepositoryMock.save).toHaveBeenCalledWith(savedPatient);
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const patients = [{ id: '1', name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' }];
      patientRepositoryMock.find.mockResolvedValue(patients);

      const result = await service.findAll();

      expect(result).toEqual(patients);
      expect(patientRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single patient', async () => {
      const patientId = '1';
      const patient = { id: patientId, name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' };
      patientRepositoryMock.findOne.mockResolvedValue(patient);

      const result = await service.findOne(patientId);

      expect(result).toEqual(patient);
      expect(patientRepositoryMock.findOne).toHaveBeenCalledWith(patientId);
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const patientId = '1';
      const updatePatientDto = { name: 'Jane Doe Updated' };
      const patient = { id: patientId, name: 'Jane Doe', dateOfBirth: new Date(), contactDetails: '1234567890' };

      patientRepositoryMock.findOne.mockResolvedValue(patient);

      const result = await service.update(patientId, updatePatientDto);

      expect(result).toEqual({ id: patientId, ...updatePatientDto });
      expect(patientRepositoryMock.findOne).toHaveBeenCalledWith(patientId);
      expect(patientRepositoryMock.merge).toHaveBeenCalledWith(patient, updatePatientDto);
      expect(patientRepositoryMock.save).toHaveBeenCalledWith(patient);
    });
  });

  describe('remove', () => {
    it('should remove a patient', async () => {
      const patientId = '1';
      const patient = { id: patientId, name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' };

      patientRepositoryMock.findOne.mockResolvedValue(patient);

      await service.remove(patientId);

      expect(patientRepositoryMock.findOne).toHaveBeenCalledWith(patientId);
      expect(patientRepositoryMock.remove).toHaveBeenCalledWith(patient);
    });
  });
});
