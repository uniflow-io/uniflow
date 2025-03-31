import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
  name: 'lead'
})
export default class LeadEntity {
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
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  githubUsername: string|null;

  @Column({
    type: "boolean",
    default: false,
    nullable: false,
  })
  optinNewsletter: boolean;

  @Column({
    type: "boolean",
    default: false,
    nullable: false,
  })
  optinBlog: boolean;

  @Column({
    type: "boolean",
    default: false,
    nullable: false,
  })
  optinGithub: boolean;

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
