import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ProgramEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ProgramRepository extends AbstractRepository<ProgramEntity> {
  getRepository<ProgramEntity>(): Repository<ProgramEntity> {
    return getRepository<ProgramEntity>(ProgramEntity)
  }
}
