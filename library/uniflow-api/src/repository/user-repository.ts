import { Service } from 'typedi';
import { getRepository, RemoveOptions, Repository } from 'typeorm';
import { UserEntity } from '../entity';
import { TypeCheckerModel } from '../model';
import AbstractRepository from './abstract-repository';
import FolderRepository from './folder-repository';
import ProgramRepository from './program-repository';

@Service()
export default class UserRepository extends AbstractRepository<UserEntity> {
  constructor(
    private programRepository: ProgramRepository,
    private folderRepository: FolderRepository,
  ) {
    super()
  }

  getRepository<UserEntity>(): Repository<UserEntity> {
    return getRepository<UserEntity>(UserEntity)
  }

  public async safeRemove(entities: UserEntity[], options?: RemoveOptions): Promise<UserEntity[]>;
  public async safeRemove(entity: UserEntity, options?: RemoveOptions): Promise<UserEntity>;
  public async safeRemove(entityOrEntities: any, options?: RemoveOptions): Promise<UserEntity | UserEntity[]> {
    if(entityOrEntities instanceof UserEntity) {
      const programs = await this.programRepository.find({user: entityOrEntities})
      for(const program of programs) {
        await this.programRepository.safeRemove(program)
      }
      const folders = await this.folderRepository.find({user: entityOrEntities})
      for(const folder of folders) {
        await this.folderRepository.safeRemove(folder)
      }
      
      return await super.safeRemove(entityOrEntities, options);
    }

    return Promise.all(entityOrEntities.map((entity: UserEntity) => this.safeRemove(entity)))
  }

  public async findOneByUidOrUsername(uidOrUsername: string): Promise<UserEntity|undefined> {
    if(TypeCheckerModel.isUuid(uidOrUsername)) {
      return await this.findOne({uid: uidOrUsername})
    }

    return await this.findOne({username: uidOrUsername})
  }
}
