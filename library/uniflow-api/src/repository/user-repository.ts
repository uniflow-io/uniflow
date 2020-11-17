import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity';
import { TypeCheckerModel } from '../model';
import AbstractRepository from './abstract-repository';

@Service()
export default class UserRepository extends AbstractRepository<UserEntity> {
  getRepository<UserEntity>(): Repository<UserEntity> {
    return getRepository<UserEntity>(UserEntity)
  }

  public async findOneByUidOrUsername(uidOrUsername: string): Promise<UserEntity|undefined> {
    if(TypeCheckerModel.isUuid(uidOrUsername)) {
      return await this.findOne({uid: uidOrUsername})
    }

    return await this.findOne({username: uidOrUsername})
  }
}
