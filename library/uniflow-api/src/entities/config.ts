import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export default class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uid: string;

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
