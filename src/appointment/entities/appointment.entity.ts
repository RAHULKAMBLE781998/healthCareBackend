import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['doctor', 'dateTime' , 'patient' ])
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Patient)
    patient: Patient;

    @ManyToOne(() => Doctor)
    doctor: Doctor;

    @Column()
    dateTime: Date;

    @Column()
    status: string; // Enum might be better for status
}
