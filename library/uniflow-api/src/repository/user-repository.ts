import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class UserRepository extends AbstractRepository<UserEntity> {
  getRepository<UserEntity>(): Repository<UserEntity> {
    return getRepository<UserEntity>(UserEntity)
  }
}
