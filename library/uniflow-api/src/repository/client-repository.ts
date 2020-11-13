import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ClientEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ClientRepository extends AbstractRepository<ClientEntity> {
  getRepository<ClientEntity>(): Repository<ClientEntity> {
    return getRepository<ClientEntity>(ClientEntity)
  }
}
