import {
  Entity,
  ManyToOne,
} from 'typeorm';
import { ClientEntity, ProgramEntity } from "../entity";

@Entity({
  name: 'program_client'
})
export default class ProgramClientEntity {
  @ManyToOne(type => ProgramEntity, program => program.clients, {
    primary: true
  })
  program: ProgramEntity

  @ManyToOne(type => ClientEntity, client => client.programs, {
    primary: true
  })
  client: ClientEntity
}
