import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ProgramEntity, UserEntity} from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ProgramRepository extends AbstractRepository<ProgramEntity> {
  getRepository<ProgramEntity>(): Repository<ProgramEntity> {
    return getRepository<ProgramEntity>(ProgramEntity)
  }

  public async findOneByUid(uid?: string): Promise<ProgramEntity | undefined> {
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.uid = :uid').setParameter('uid', uid)

    return await qb.getOne();
  }

  public async findOneByUserAndUid(user: UserEntity, uid: string): Promise<ProgramEntity | undefined> {
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.uid = :uid').setParameter('uid', uid)
      .andWhere('p.user = :user').setParameter('user', user.id)

    return await qb.getOne();
  }
}
