import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { LeadEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class LeadRepository extends AbstractRepository<LeadEntity> {
  getRepository<LeadEntity>(): Repository<LeadEntity> {
    return getRepository<LeadEntity>(LeadEntity)
  }
}
