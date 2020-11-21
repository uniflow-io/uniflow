import { Service } from 'typedi';
import { ProgramEntity, ProgramClientEntity} from '../entity';
import { ProgramClientFactory } from '../factory';
import { ProgramClientRepository } from '../repository';
import ClientService from "./client-service";

@Service()
export default class ProgramClientService {
  constructor(
    private programClientRepository: ProgramClientRepository,
    private clientService: ClientService,
    private programClientFactory: ProgramClientFactory,
  ) {}

  public async manageByProgramAndClientNames(program: ProgramEntity, names: string[]): Promise<ProgramClientEntity[]> {
    let programClients: ProgramClientEntity[] = []
    if(program.id) {
      programClients = await this.programClientRepository.findByProgram(program)
    }
    
    await this.programClientRepository.safeRemove(programClients)
    
    programClients = []

    const clients = await this.clientService.findOrCreateByNames(names)
    
    for(const client of clients) {
      programClients.push(this.programClientFactory.create({ program, client }));
    }
    
    return programClients
  }

  public async toClientNames(program: ProgramEntity): Promise<string[]> {
    let programClients: ProgramClientEntity[] = []
    if(program.id) {
      programClients = await this.programClientRepository.findByProgram(program)
    }
    
    return this.clientService.toNames(
      programClients.map((programClient) => {
        return programClient.client
      })
    )
  }
}
