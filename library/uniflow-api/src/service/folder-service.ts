import slugify from 'slugify'
import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { FolderEntity, UserEntity } from '../entity';

@Service()
export default class FolderService {
  private getFolderRepository(): Repository<FolderEntity> {
    return getRepository(FolderEntity)
  }
  
  public async save(folder: FolderEntity): Promise<FolderEntity> {
    return await this.getFolderRepository().save(folder);
  }
  
  public async remove(folder: FolderEntity): Promise<FolderEntity> {
    return await this.getFolderRepository().remove(folder);
  }

  public async findOne(id?: string | number): Promise<FolderEntity | undefined> {
    let qb = this.getFolderRepository().createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', id)

    return await qb.getOne();
  }

  public async findOneByUser(user: UserEntity, id: string | number): Promise<FolderEntity | undefined> {
    let qb = this.getFolderRepository().createQueryBuilder('f')
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

    let qb = this.getFolderRepository()
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
    let qb = this.getFolderRepository().createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', folder.id)

    return (await qb.getOne())?.parent
  }

  public async findByUser(user: UserEntity): Promise<FolderEntity[]> {
    let qb = this.getFolderRepository()
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.user = :user').setParameter('user', user.id)

    return await qb.getMany()
  }

  public async findByUserAndParent(user: UserEntity, parent?: FolderEntity): Promise<FolderEntity[]> {
    let qb = this.getFolderRepository()
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

  public async toPath(folder?: FolderEntity): Promise<string[]> {
    let path = []
    
    while(folder) {
      path.unshift(folder.slug)
      
      folder = await this.findOneParent(folder)
    }
    
    return path
  }
  
  public async generateUniqueSlug(user: UserEntity, slug: string): Promise<string> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    const folder = await this.getFolderRepository().findOne({user, slug})
    if(folder) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueSlug(user, `${slug}-${suffix}` )
    }
    
    return slug
  }

  public async isValid(folder: FolderEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(folder: FolderEntity): Promise<Object> {
    return {
      'uid': folder.uid,
      'name': folder.name,
      'slug': folder.slug,
      'path': await this.toPath(folder.parent),
      'created': folder.created.toISOString(),
      'updated': folder.updated.toISOString(),
    }
  }
}
