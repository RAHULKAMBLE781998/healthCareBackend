import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

describe('PatientController', () => {
  let controller: PatientController;
  let service: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [PatientService],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const result = [{ id: '1', name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single patient', async () => {
      const result = { id: '1', name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const createDto = { name: 'Jane Doe', dateOfBirth: new Date(), contactDetails: '0987654321' };
      const result = { id: '2', ...createDto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const updateDto = { name: 'Jane Doe Updated' };
      const result = { id: '1', name: 'Jane Doe Updated', dateOfBirth: new Date(), contactDetails: '1234567890' };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a patient', async () => {
      const result = { id: '1', name: 'John Doe', dateOfBirth: new Date(), contactDetails: '1234567890' };
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
  
      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
