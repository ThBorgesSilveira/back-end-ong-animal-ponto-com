import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    type: "boolean",
    default: true,
  })
  status: boolean;

  @Column({
    type: "char",
    length: 2,
    name: "country_code",
    default: "BR",
  })
  countryCode: string;

  @Column({
    type: "varchar",
    length: 50,
  })
  state: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  city: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  district: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  street: string;

  @Column({
    type: "varchar",
    length: 10,
    nullable: true,
  })
  number?: string;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  complement?: string;

  @Column({
    type: "char",
    length: 8,
    name: "postal_code",
  })
  postalCode: string;
}
