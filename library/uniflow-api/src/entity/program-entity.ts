import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FolderEntity, UserEntity, ProgramClientEntity, ProgramTagEntity } from "../entity";

@Entity({
  name: 'program'
})
export default class ProgramEntity {
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
    unique: true,
    nullable: false,
  })
  slug: string;

  @ManyToOne(type => UserEntity, user => user.programs)
  user: UserEntity

  @ManyToOne(type => FolderEntity, folder => folder.programs)
  folder: FolderEntity | undefined
  
  @OneToMany(type => ProgramClientEntity, programClient => programClient.program, {
    cascade: ['insert']
  })
  clients: ProgramClientEntity[]

  @OneToMany(type => ProgramTagEntity, programTag => programTag.program, {
    cascade: ['insert']
  })
  tags: ProgramTagEntity[]

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  public: string;

  @Column({
    type: "text",
    nullable: true,
  })
  data: string;

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
