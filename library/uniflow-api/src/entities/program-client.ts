import {
  Entity,
  ManyToOne,
} from 'typeorm';
import Client from "./client";
import Program from "./program";

@Entity()
export default class ProgramClient {
  @ManyToOne(type => Program, program => program.clients, {
    primary: true
  })
  program: Program

  @ManyToOne(type => Client, client => client.programs, {
    primary: true
  })
  client: Client
}
