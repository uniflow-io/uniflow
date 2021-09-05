import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { FolderEntity, ProgramEntity } from "../entity";
import { ROLE } from '../model/api-type-interfaces';

@Entity({
  name: 'user'
})
export default class UserEntity {
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
  username: string|null;

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
  password: string|null;
  plainPassword?: string|null

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
  firstname: string|null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  lastname: string|null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  facebookId: string|null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  githubId: string|null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  apiKey: string|null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  role: ROLE;
  roles: ROLE[];

  @OneToMany(type => ProgramEntity, program => program.user, {
    cascade: ['insert']
  })
  programs: ProgramEntity[];

  @OneToMany(type => FolderEntity, folder => folder.user, {
    cascade: ['insert']
  })
  folders: FolderEntity[];

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
