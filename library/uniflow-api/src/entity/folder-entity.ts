import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { UserEntity, ProgramEntity } from "../entity";

@Entity({
  name: 'folder'
})
export default class FolderEntity {
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
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
  })
  slug: string;

  @ManyToOne(type => UserEntity, user => user.folders)
  user: UserEntity;
  
  @ManyToOne(type => FolderEntity, parent => parent.children)
  parent: FolderEntity | undefined

  @OneToMany(type => FolderEntity, child => child.parent, {
    cascade: ['insert']
  })
  children: FolderEntity[]

  @OneToMany(type => ProgramEntity, program => program.folder, {
    cascade: ['insert']
  })
  programs: ProgramEntity[]

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
