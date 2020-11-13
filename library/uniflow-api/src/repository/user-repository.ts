import * as argon2 from 'argon2';
import slugify from "slugify";
import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity';
import { randomBytes } from 'crypto';
import { ApiException } from '../exception';
import AbstractRepository from './abstract-repository';

@Service()
export default class UserRepository extends AbstractRepository<UserEntity> {
  getRepository<UserEntity>(): Repository<UserEntity> {
    return getRepository<UserEntity>(UserEntity)
  }
}
