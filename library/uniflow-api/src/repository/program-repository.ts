import { Service } from 'typedi';
import { getRepository, RemoveOptions, Repository } from 'typeorm';
import { ProgramEntity } from '../entity';
import AbstractRepository from './abstract-repository';
import ProgramClientRepository from './program-client-repository';
import ProgramTagRepository from './program-tag-repository';

@Service()
export default class ProgramRepository extends AbstractRepository<ProgramEntity> {
  constructor(
    private programClientRepository: ProgramClientRepository,
    private programTagRepository: ProgramTagRepository,
  ) {
    super();
  }

  getRepository<ProgramEntity>(): Repository<ProgramEntity> {
    return getRepository<ProgramEntity>(ProgramEntity)
  }

  public async safeRemove(entities: ProgramEntity[], options?: RemoveOptions): Promise<ProgramEntity[]>;
  public async safeRemove(entity: ProgramEntity, options?: RemoveOptions): Promise<ProgramEntity>;
  public async safeRemove(entityOrEntities: any, options?: RemoveOptions): Promise<ProgramEntity | ProgramEntity[]> {
    if(entityOrEntities instanceof ProgramEntity) {
      const programClients = await this.programClientRepository.find({
        where: { program: entityOrEntities },
        relations: ['program', 'client'],
      })
      for(const programClient of programClients) {
        await this.programClientRepository.safeRemove(programClient)
      }

      const programTags = await this.programTagRepository.find({
        where: { program: entityOrEntities },
        relations: ['program', 'tag'],
      })
      for(const programTag of programTags) {
        await this.programTagRepository.safeRemove(programTag)
      }
      
      return await super.safeRemove(entityOrEntities, options);
    }

    return Promise.all(entityOrEntities.map((entity: ProgramEntity) => this.safeRemove(entity)))
  }
}
