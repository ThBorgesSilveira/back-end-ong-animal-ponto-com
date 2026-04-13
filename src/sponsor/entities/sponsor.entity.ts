import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Person } from "../../person/entities/person.entity";

@Entity()
export class Sponsor {
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
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  amount!: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  recurrence!: string;

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

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  billingType!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  billingData!: string;

  @ManyToOne(() => Person)
  @JoinColumn({ name: "person_id" })
  person!: Person;

  @Column({ name: "person_id" })
  personId!: number;
}
