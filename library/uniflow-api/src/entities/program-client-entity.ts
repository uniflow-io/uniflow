import {
  Entity,
  ManyToOne,
} from 'typeorm';
import { ClientEntity, ProgramEntity } from "../entities";

@Entity({
  name: 'program-client'
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
