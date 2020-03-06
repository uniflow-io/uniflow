import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: "text",
    nullable: false,
  })
  message: string;

  @CreateDateColumn()
  created: Date

  @CreateDateColumn()
  updated: Date
}
