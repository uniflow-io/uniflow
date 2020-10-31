import {
  Entity,
  ManyToOne,
} from 'typeorm';
import Tag from "./tag";
import Program from "./program";

@Entity()
export default class ProgramTag {
  @ManyToOne(type => Program, program => program.tags, {
    primary: true
  })
  program: Program

  @ManyToOne(type => Tag, tag => tag.programs, {
    primary: true
  })
  tag: Tag
}
