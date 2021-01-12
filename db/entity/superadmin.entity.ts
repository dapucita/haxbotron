import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SuperAdmin {
    @PrimaryGeneratedColumn()
    uid!: number;

    @Column()
    ruid!: string;

    @Column()
    key!: string; 

    @Column()
    description!: string;
}