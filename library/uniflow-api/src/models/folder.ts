import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import {User} from "./user";
import {Program} from "./program";

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
  })
  slug: string;

  @ManyToOne(type => User, user => user.folders)
  user: User;
  
  @ManyToOne(type => Folder, parent => parent.children)
  parent: Folder | undefined

  @OneToMany(type => Folder, child => child.parent, {
    cascade: ['insert']
  })
  children: Folder[]

  @OneToMany(type => Program, program => program.folder, {
    cascade: ['insert']
  })
  programs: Program[]

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
