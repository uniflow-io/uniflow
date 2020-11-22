import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { ProgramClientEntity } from "../entity";

@Entity({
  name: 'client'
})
export default class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uid: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(type => ProgramClientEntity, programClient => programClient.client, {
    cascade: ['insert']
  })
  programs: ProgramClientEntity[];

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
