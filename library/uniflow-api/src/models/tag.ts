import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import {ProgramTag} from "./program-tag";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(type => ProgramTag, programTag => programTag.tag, {
    cascade: ['insert']
  })
  programs: ProgramTag[];

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
