import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Address } from "../../address/entities/address.entity";

@Entity()
export class Person {
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
    length: 255,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 50,
  })
  personType!: string;

  @Column({
    type: "varchar",
    length: 20,
    unique: true,
  })
  cpfCnpj!: string;

  @ManyToOne(() => Address)
  @JoinColumn({
    name: "address_id"
  })
  address!: Address;

  @Column({
    name: "address_id"
  })
  addressId!: number;
}
