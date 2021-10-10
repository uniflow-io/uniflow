import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ProgramClientEntity, ProgramEntity} from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ProgramClientRepository extends AbstractRepository<ProgramClientEntity> {
  getRepository<ProgramClientEntity>(): Repository<ProgramClientEntity> {
    return getRepository<ProgramClientEntity>(ProgramClientEntity)
  }

  public async findByProgram(program: ProgramEntity): Promise<ProgramClientEntity[]> {
    const qb = this.getRepository<ProgramClientEntity>().createQueryBuilder('pc')
        .select('pc')
        .leftJoinAndSelect('pc.program', 'p')
        .leftJoinAndSelect('pc.client', 'c')
        .andWhere('pc.program = :program').setParameter('program', program.id)

    return await qb.getMany();
  }
}
