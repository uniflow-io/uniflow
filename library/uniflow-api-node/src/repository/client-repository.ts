import { Service } from 'typedi';
import { getRepository, RemoveOptions, Repository } from 'typeorm';
import { ClientEntity } from '../entity';
import AbstractRepository from './abstract-repository';
import ProgramClientRepository from './program-client-repository';

@Service()
export default class ClientRepository extends AbstractRepository<ClientEntity> {
  constructor(
    private programClientRepository: ProgramClientRepository,
  ) {
    super()
  }

  getRepository<ClientEntity>(): Repository<ClientEntity> {
    return getRepository<ClientEntity>(ClientEntity)
  }

  public async safeRemove(entities: ClientEntity[], options?: RemoveOptions): Promise<ClientEntity[]>;
  public async safeRemove(entity: ClientEntity, options?: RemoveOptions): Promise<ClientEntity>;
  public async safeRemove(entityOrEntities: any, options?: RemoveOptions): Promise<ClientEntity | ClientEntity[]> {
    if(entityOrEntities instanceof ClientEntity) {
      const programClients = await this.programClientRepository.find({
        where: {client: entityOrEntities},
        relations: ['program', 'client'],
      })
      for(const programClient of programClients) {
        await this.programClientRepository.safeRemove(programClient)
      }
      
      return await super.safeRemove(entityOrEntities, options);
    }

    return Promise.all(entityOrEntities.map((entity: ClientEntity) => this.safeRemove(entity)))
  }
}
