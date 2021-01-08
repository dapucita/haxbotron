import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BanList {
    @PrimaryGeneratedColumn()
    uid!: number;

    @Column({unique: true})
    conn!: string; 

    @Column()
    reason!: string;

    @Column()
    register!: number; 

    @Column()
    expire!: number; 
}