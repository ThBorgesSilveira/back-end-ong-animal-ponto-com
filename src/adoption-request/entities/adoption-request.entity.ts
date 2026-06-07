import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Adopter } from "../../adopter/entities/adopter.entity";
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

  @ManyToOne(() => Adopter)
  @JoinColumn({ name: "adopter_id" })
  adopter!: Adopter;

  @Column({ name: "adopter_id" })
  adopterId!: number;

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
