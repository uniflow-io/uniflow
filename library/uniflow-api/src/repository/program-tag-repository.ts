import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ProgramEntity, ProgramTagEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ProgramTagRepository extends AbstractRepository<ProgramTagEntity> {
  getRepository<ProgramTagEntity>(): Repository<ProgramTagEntity> {
    return getRepository<ProgramTagEntity>(ProgramTagEntity)
  }

  public async findByProgram(program: ProgramEntity): Promise<ProgramTagEntity[]> {
    const qb = this.getRepository<ProgramTagEntity>().createQueryBuilder('pt')
        .select('pt')
        .leftJoinAndSelect('pt.program', 'p')
        .leftJoinAndSelect('pt.tag', 'c')
        .andWhere('pt.program = :program').setParameter('program', program.id)

    return await qb.getMany();
  }
}
