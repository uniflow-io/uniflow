import {
  Entity,
  ManyToOne,
} from 'typeorm';
import { TagEntity, ProgramEntity } from "../entity";

@Entity({
  name: 'program_tag'
})
export default class ProgramTagEntity {
  @ManyToOne(type => ProgramEntity, program => program.tags, {
    primary: true
  })
  program: ProgramEntity

  @ManyToOne(type => TagEntity, tag => tag.programs, {
    primary: true
  })
  tag: TagEntity
}
