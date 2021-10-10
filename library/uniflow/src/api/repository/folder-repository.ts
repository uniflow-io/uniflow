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

  /**
   * return the folder given paths (as concatenation of slugs) for the user
   * @param user the user provided to find the folder
   * @param paths slugs list viewed as path
   */
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

  /**
   * hydrate folder and return his parent folder
   * @param folder folder to hydrate
   */
  public async findOneParent(folder: FolderEntity): Promise<FolderEntity | undefined> {
    const hydratedFolder = await this.findOne({
      where: {id: folder.id},
      relations: ['parent']
    })
    
    if(hydratedFolder && hydratedFolder.parent) {
      return hydratedFolder.parent
    }

    return undefined
  }

  /**
   * check if folder has circular dependency with parent
   * @param folder folder to check circular dependency
   * @param parent parent folder to check circular dependency
   */
  public async isCircular(folder: FolderEntity, parent: FolderEntity): Promise<boolean> {
    if(folder.id === parent.id) {
      return true
    }

    const nextParent = await this.findOneParent(parent)
    return nextParent ? await this.isCircular(folder, nextParent) : false
  }
}
