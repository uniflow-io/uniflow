import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
  name: 'config'
})
export default class ConfigEntity {
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
