import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Person } from "../../person/entities/person.entity";
import { Animal } from "../../animal/entities/animal.entity";

export enum EnumAdoptionRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity()
export class AdoptionRequest {
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

  @ManyToOne(() => Person)
  @JoinColumn({ name: "person_id" })
  person!: Person;

  @Column({ name: "person_id" })
  personId!: number;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: "animal_id" })
  animal!: Animal;

  @Column({ name: "animal_id" })
  animalId!: number;

  @Column({
    type: "text",
    nullable: true,
  })
  notes!: string;

  @Column({
    type: "enum",
    enum: EnumAdoptionRequestStatus,
    default: EnumAdoptionRequestStatus.PENDING,
  })
  status!: EnumAdoptionRequestStatus;
}
