import { Service, Container } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import { Program, ProgramClient} from '../models';
import ClientService from "./client";

@Service()
export default class ProgramClientService {
  private programClientRepository: Repository<ProgramClient>;
  private clientService: ClientService;

  constructor() {
    this.programClientRepository = getRepository(ProgramClient)
    this.clientService = Container.get(ClientService)
  }

  public async save(programClient: ProgramClient): Promise<ProgramClient> {
    return await this.programClientRepository.save(programClient);
  }

  public async findOne(id?: string | number): Promise<ProgramClient | undefined> {
    return await this.programClientRepository.findOne(id);
  }

  public async manageByProgramAndClientNames(program: Program, names: string[]): Promise<ProgramClient[]> {
    let programClients: ProgramClient[] = []
    if(program.id) {
      let qb = this.programClientRepository.createQueryBuilder('pc')
        .select('pc')
        .leftJoinAndSelect('pc.program', 'p')
        .leftJoinAndSelect('pc.client', 'c')
        .andWhere('pc.program = :program').setParameter('program', program.id)

      programClients = await qb.getMany();
    }
    
    await this.programClientRepository.remove(programClients)
    
    programClients = []

    const clients = await this.clientService.findOrCreateByNames(names)
    
    for(const client of clients) {
      const programClient = new ProgramClient()
      programClient.program = program
      programClient.client = client
    
      programClients.push(programClient);
    }
    
    return programClients
  }

  public async toClientNames(program: Program): Promise<string[]> {
    let programClients: ProgramClient[] = []
    if(program.id) {
      let qb = this.programClientRepository.createQueryBuilder('pc')
        .select('pc')
        .leftJoinAndSelect('pc.program', 'p')
        .leftJoinAndSelect('pc.client', 'c')
        .andWhere('pc.program = :program').setParameter('program', program.id)

      programClients = await qb.getMany();
    }
    
    return this.clientService.toNames(
      programClients.map((programClient) => {
        return programClient.client
      })
    )
  }
}
