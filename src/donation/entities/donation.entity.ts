import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Person } from "../../person/entities/person.entity";

@Entity()
export class Donation {
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
    type: "varchar",
    length: 100,
  })
  donationType!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    type: "text",
    nullable: true,
  })
  notes!: string;

  @ManyToOne(() => Person)
  @JoinColumn({ name: "person_id" })
  person!: Person;

  @Column({ name: "person_id" })
  personId!: number;
}
