import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ContactEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ContactRepository extends AbstractRepository<ContactEntity> {
  getRepository<ContactEntity>(): Repository<ContactEntity> {
    return getRepository<ContactEntity>(ContactEntity)
  }
}
