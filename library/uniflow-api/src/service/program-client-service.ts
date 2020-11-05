import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ProgramEntity, ProgramClientEntity} from '../entity';
import { ClientService } from "../service";

@Service()
export default class ProgramClientService {
  constructor(
    private clientService: ClientService
  ) {}

  private getProgramClientRepository(): Repository<ProgramClientEntity> {
    return getRepository(ProgramClientEntity)
  }

  public async save(programClient: ProgramClientEntity): Promise<ProgramClientEntity> {
    return await this.getProgramClientRepository().save(programClient);
  }

  public async findOne(id?: string | number): Promise<ProgramClientEntity | undefined> {
    return await this.getProgramClientRepository().findOne(id);
  }

  public async manageByProgramAndClientNames(program: ProgramEntity, names: string[]): Promise<ProgramClientEntity[]> {
    let programClients: ProgramClientEntity[] = []
    if(program.id) {
      let qb = this.getProgramClientRepository().createQueryBuilder('pc')
        .select('pc')
        .leftJoinAndSelect('pc.program', 'p')
        .leftJoinAndSelect('pc.client', 'c')
        .andWhere('pc.program = :program').setParameter('program', program.id)

      programClients = await qb.getMany();
    }
    
    await this.getProgramClientRepository().remove(programClients)
    
    programClients = []

    const clients = await this.clientService.findOrCreateByNames(names)
    
    for(const client of clients) {
      const programClient = new ProgramClientEntity()
      programClient.program = program
      programClient.client = client
    
      programClients.push(programClient);
    }
    
    return programClients
  }

  public async toClientNames(program: ProgramEntity): Promise<string[]> {
    let programClients: ProgramClientEntity[] = []
    if(program.id) {
      let qb = this.getProgramClientRepository().createQueryBuilder('pc')
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
