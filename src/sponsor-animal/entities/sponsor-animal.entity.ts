import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Sponsor } from "../../sponsor/entities/sponsor.entity";
import { Animal } from "../../animal/entities/animal.entity";

@Entity()
export class SponsorAnimal {
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

  @ManyToOne(() => Sponsor)
  @JoinColumn({ name: "sponsor_id" })
  sponsor!: Sponsor;

  @Column({ name: "sponsor_id" })
  sponsorId!: number;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: "animal_id" })
  animal!: Animal;

  @Column({ name: "animal_id" })
  animalId!: number;
}
