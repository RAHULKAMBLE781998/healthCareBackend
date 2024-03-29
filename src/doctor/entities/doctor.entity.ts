import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    department: string;

    @Column()
    contactDetails: string;

    @Column()
    availability: string; // You might want to use a more specific type for availability
}