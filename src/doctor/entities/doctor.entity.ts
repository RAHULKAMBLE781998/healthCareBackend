import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

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

        @Column({ default: '09:00-17:00' }) // Default availability time from 9 AM to 5 PM
        availability: string;
    
        @BeforeInsert()
        setDefaultAvailability() {
            if (!this.availability) {
                this.availability = '09:00-17:00'; // Default availability time if not provided
            }
        }
    }
