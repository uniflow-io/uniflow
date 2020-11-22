import { Service } from 'typedi';
import { getRepository, RemoveOptions, Repository } from 'typeorm';
import { TagEntity } from '../entity';
import AbstractRepository from './abstract-repository';
import ProgramTagRepository from './program-tag-repository';

@Service()
export default class TagRepository extends AbstractRepository<TagEntity> {
  constructor(
    private programTagRepository: ProgramTagRepository,
  ) {
    super()
  }

  getRepository<TagEntity>(): Repository<TagEntity> {
    return getRepository<TagEntity>(TagEntity)
  }

  public async safeRemove(entities: TagEntity[], options?: RemoveOptions): Promise<TagEntity[]>;
  public async safeRemove(entity: TagEntity, options?: RemoveOptions): Promise<TagEntity>;
  public async safeRemove(entityOrEntities: any, options?: RemoveOptions): Promise<TagEntity | TagEntity[]> {
    if(entityOrEntities instanceof TagEntity) {
      const programTags = await this.programTagRepository.find({
        where: {tag: entityOrEntities },
        relations: ['program', 'tag'],
      })
      for(const programTag of programTags) {
        await this.programTagRepository.safeRemove(programTag)
      }
      
      return await super.safeRemove(entityOrEntities, options);
    }

    return Promise.all(entityOrEntities.map((entity: TagEntity) => this.safeRemove(entity)))
  }

  public async clear(): Promise<TagEntity[]> {
    const qb = this.getRepository<TagEntity>().createQueryBuilder('t')
      .select('t')
      .leftJoinAndSelect('t.programs', 'pt')
      .andWhere('pt.program is NULL')
    
    return await this.safeRemove(await qb.getMany())
  }
}
