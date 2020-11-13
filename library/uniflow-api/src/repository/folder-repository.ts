import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { FolderEntity, UserEntity } from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class FolderRepository extends AbstractRepository<FolderEntity> {
  getRepository<FolderEntity>(): Repository<FolderEntity> {
    return getRepository<FolderEntity>(FolderEntity)
  }

  public async findOne(id?: any): Promise<FolderEntity | undefined> {
    const qb = this.getRepository<FolderEntity>().createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', id)

    return await qb.getOne();
  }

  public async findOneByUser(user: UserEntity, id: string | number): Promise<FolderEntity | undefined> {
    const qb = this.getRepository<FolderEntity>().createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', id)
      .andWhere('f.user = :user').setParameter('user', user.id)

    return await qb.getOne();
  }

  public async findOneByUserAndPath(user: UserEntity, path: string[]): Promise<FolderEntity | undefined> {
    const level = path.length
    if (level === 0) {
      return undefined
    }
    
    let parent = undefined
    if (level > 1) {
      parent = await this.findOneByUserAndPath(user, path.slice(0, level - 1))
    }

    const qb = this.getRepository<FolderEntity>()
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.user = :user').setParameter('user', user.id)
      .andWhere('f.slug = :slug').setParameter('slug', path[level - 1])
    
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

  public async findByUser(user: UserEntity): Promise<FolderEntity[]> {
    const qb = this.getRepository<FolderEntity>()
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.user = :user').setParameter('user', user.id)

    return await qb.getMany()
  }

  public async findByUserAndParent(user: UserEntity, parent?: FolderEntity): Promise<FolderEntity[]> {
    const qb = this.getRepository<FolderEntity>()
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.user = :user').setParameter('user', user.id)

    if (parent) {
      qb.andWhere('f.parent = :parent').setParameter('parent', parent.id)
    } else {
      qb.andWhere('f.parent is NULL')
    }
    
    return await qb.getMany()
  }
}
