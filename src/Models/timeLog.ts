import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Job {

    @PrimaryGeneratedColumn()
    id: number ;

    @Column()
    firstname: string;

    @Column()
    jobname: string;

    @Column()
    workdate: string;

    @Column()
    hours: string;
}