import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {Folder} from "./folder";
import {User} from "./user";
import {ProgramClient} from "./program-client";
import {ProgramTag} from "./program-tag";

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;
  
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

  @ManyToOne(type => User, user => user.programs)
  user: User

  @ManyToOne(type => Folder, folder => folder.programs)
  folder: Folder | undefined
  
  @OneToMany(type => ProgramClient, programClient => programClient.program, {
    cascade: ['insert']
  })
  clients: ProgramClient[]

  @OneToMany(type => ProgramTag, programTag => programTag.program, {
    cascade: ['insert']
  })
  tags: ProgramTag[]

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
