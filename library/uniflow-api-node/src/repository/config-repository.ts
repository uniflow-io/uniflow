import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ConfigEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ConfigRepository  extends AbstractRepository<ConfigEntity> {
  getRepository<ConfigEntity>(): Repository<ConfigEntity> {
    return getRepository<ConfigEntity>(ConfigEntity)
  }
}
