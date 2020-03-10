import slugify from 'slugify'
import { Service } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import {Folder, User} from '../models';

@Service()
export default class FolderService {
  private folderRepository: Repository<Folder>;

  constructor() {
    this.folderRepository = getRepository(Folder)
  }

  public async save(folder: Folder): Promise<Folder> {
    return await this.folderRepository.save(folder);
  }
  
  public async remove(folder: Folder): Promise<Folder> {
    return await this.folderRepository.remove(folder);
  }

  public async findOne(id?: string | number): Promise<Folder | undefined> {
    let qb = this.folderRepository.createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', id)

    return await qb.getOne();
  }

  public async findOneByUser(user: User, id: string | number): Promise<Folder | undefined> {
    let qb = this.folderRepository.createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', id)
      .andWhere('f.user = :user').setParameter('user', user.id)

    return await qb.getOne();
  }

  public async findOneByUserAndPath(user: User, path: string[]): Promise<Folder | undefined> {
    const level = path.length
    if (level === 0) {
      return undefined
    }
    
    let parent = undefined
    if (level > 1) {
      parent = await this.findOneByUserAndPath(user, path.slice(0, level - 1))
    }

    let qb = this.folderRepository
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

  public async findOneParent(folder: Folder): Promise<Folder | undefined> {
    let qb = this.folderRepository.createQueryBuilder('f')
      .select('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.id = :id').setParameter('id', folder.id)

    return (await qb.getOne())?.parent
  }

  public async findByUser(user: User): Promise<Folder[]> {
    let qb = this.folderRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.parent', 'parent')
      .andWhere('f.user = :user').setParameter('user', user.id)

    return await qb.getMany()
  }

  public async findByUserAndParent(user: User, parent?: Folder): Promise<Folder[]> {
    let qb = this.folderRepository
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

  public async toPath(folder?: Folder): Promise<string[]> {
    let path = []
    
    while(folder) {
      path.unshift(folder.slug)
      
      folder = await this.findOneParent(folder)
    }
    
    return path
  }
  
  public async generateUniqueSlug(user: User, slug: string): Promise<string> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    const folder = await this.folderRepository.findOne({user, slug})
    if(folder) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueSlug(user, `${slug}-${suffix}` )
    }
    
    return slug
  }

  public async isValid(folder: Folder): Promise<boolean> {
    return true
  }
  
  public async getJson(folder: Folder): Promise<Object> {
    return {
      'id': folder.id,
      'name': folder.name,
      'slug': folder.slug,
      'path': await this.toPath(folder.parent),
      'created': folder.created.toISOString(),
      'updated': folder.updated.toISOString(),
    }
  }
}
