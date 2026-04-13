import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Person } from "../../person/entities/person.entity";

@Entity()
export class Adopter {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: "int",
    nullable: true,
  })
  age!: number;

  @Column({
    type: "text",
    nullable: true,
  })
  notes!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  phone!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  socialNetwork!: string;

  @ManyToOne(() => Person)
  @JoinColumn({ name: "person_id" })
  person!: Person;

  @Column({ name: "person_id" })
  personId!: number;
}
