import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Folder from "./folder";
import Program from "./program";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uid: string;
  
  @Column({
    type: "varchar",
    length: 32,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  password: string;

  @Column({
    type: "varchar",
    length: 64,
    nullable: false,
  })
  salt: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  firstname: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  lastname: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  facebookId: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  githubId: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  apiKey: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  role: string;

  @OneToMany(type => Program, program => program.user, {
    cascade: ['insert']
  })
  programs: Program[];

  @OneToMany(type => Folder, folder => folder.user, {
    cascade: ['insert']
  })
  folders: Folder[];

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
