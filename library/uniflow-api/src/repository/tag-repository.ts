import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { TagEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class TagRepository extends AbstractRepository<TagEntity> {
  getRepository<TagEntity>(): Repository<TagEntity> {
    return getRepository<TagEntity>(TagEntity)
  }

  public async clear(): Promise<TagEntity[]> {
    const qb = this.getRepository<TagEntity>().createQueryBuilder('t')
      .select('t')
      .leftJoinAndSelect('t.programs', 'pt')
      .andWhere('pt.program is NULL')
    
    return await this.remove(await qb.getMany())
  }
}
