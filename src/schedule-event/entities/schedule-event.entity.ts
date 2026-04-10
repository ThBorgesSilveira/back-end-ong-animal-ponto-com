import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Address } from "../../address/entities/address.entity";

@Entity()
export class ScheduleEvent {
  
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
    })
    eventDate!: Date;
  
    @Column({
      type: "varchar",
      length: 255,
    })
    eventType!: string;
  
    @Column({
      type: "text",
    })
    notes?: string;
  
    @ManyToOne(() => Address)
    @JoinColumn({ name: "address_id" })
    address!: Address;
}
