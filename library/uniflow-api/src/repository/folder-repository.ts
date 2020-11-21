import { Service } from 'typedi';
import { getRepository, RemoveOptions, Repository } from 'typeorm';
import { FolderEntity, UserEntity } from '../entity';
import AbstractRepository from './abstract-repository';
import ProgramRepository from './program-repository';

@Service()
export default class FolderRepository extends AbstractRepository<FolderEntity> {
  constructor(
    private programRepository: ProgramRepository,
  ) {
    super()
  }

  getRepository<FolderEntity>(): Repository<FolderEntity> {
    return getRepository<FolderEntity>(FolderEntity)
  }

  public async safeRemove(entities: FolderEntity[], options?: RemoveOptions): Promise<FolderEntity[]>;
  public async safeRemove(entity: FolderEntity, options?: RemoveOptions): Promise<FolderEntity>;
  public async safeRemove(entityOrEntities: any, options?: RemoveOptions): Promise<FolderEntity | FolderEntity[]> {
    if(entityOrEntities instanceof FolderEntity) {
      const folderChildren = await this.find({parent: entityOrEntities})
      for(const folderChild of folderChildren) {
        await this.safeRemove(folderChild)
      }

      const programs = await this.programRepository.find({folder: entityOrEntities})
      for(const program of programs) {
        await this.programRepository.safeRemove(program)
      }
      
      return await super.safeRemove(entityOrEntities, options);
    }

    return Promise.all(entityOrEntities.map((entity: FolderEntity) => this.safeRemove(entity)))
  }

  public async findOneByUserAndPath(user: UserEntity, paths: string[]): Promise<FolderEntity | undefined> {
    const level = paths.length
    if (level === 0) {
      return undefined
    }
    
    let parent = undefined
    if (level > 1) {
      parent = await this.findOneByUserAndPath(user, paths.slice(0, level - 1))
    }

    const qb = this.getRepository<FolderEntity>()
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.user = :user').setParameter('user', user.id)
      .andWhere('f.slug = :slug').setParameter('slug', paths[level - 1])
    
    if (parent) {
      qb.andWhere('f.parent = :parent').setParameter('parent', parent.id)
    } else {
      qb.andWhere('f.parent is NULL')
    }

    return await qb.getOne()
  }

  public async findOneParent(folder: FolderEntity): Promise<FolderEntity | undefined> {
    const qb = this.getRepository<FolderEntity>().createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', folder.id)

    return (await qb.getOne())?.parent
  }

  public async isCircular(folder: FolderEntity): Promise<boolean> {
    let parentFolder: FolderEntity|undefined = folder
    do {
      parentFolder = await this.findOneParent(parentFolder)
      if(parentFolder && parentFolder.id !== folder.id) {
        return true
      }

    } while(parentFolder)

    return false
  }
}
