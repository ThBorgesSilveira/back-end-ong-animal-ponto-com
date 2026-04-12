import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Animal {
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
    type: "date",
    nullable: true,
  })
  birthDate!: Date;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  size!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  temperament!: string;

  @Column({
    type: "date",
    nullable: true,
  })
  rescueDate!: Date;

  @Column({
    type: "text",
    nullable: true,
  })
  notes!: string;
}
