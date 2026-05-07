import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Person } from "../../person/entities/person.entity";

@Entity()
export class Partner {
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
    type: "text",
    nullable: true,
  })
  notes!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  corporateName!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  tradeName!: string;

  @ManyToOne(() => Person)
  @JoinColumn({ name: "person_id" })
  person!: Person;

  @Column({ name: "person_id" })
  personId!: number;
}
