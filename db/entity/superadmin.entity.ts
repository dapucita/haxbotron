import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SuperAdmin {
    @PrimaryGeneratedColumn()
    uid!: number;

    @Column({unique: true})
    key!: string; 

    @Column()
    description!: string;
}