import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
  name: 'contact'
})
export default class ContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uid: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: "text",
    nullable: false,
  })
  message: string;

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
