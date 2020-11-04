import slugify from 'slugify'
import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { FolderEntity, ProgramEntity, UserEntity} from '../entities';
import { FolderService, ProgramClientService, ProgramTagService } from "../services";

@Service()
export default class ProgramService {
  constructor(
    private folderService: FolderService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
  ) {}

  private getProgramRepository(): Repository<ProgramEntity> {
    return getRepository(ProgramEntity)
  }

  public async save(program: ProgramEntity): Promise<ProgramEntity> {
    return await this.getProgramRepository().save(program);
  }
  
  public async remove(program: ProgramEntity): Promise<ProgramEntity> {
    return await this.getProgramRepository().remove(program);
  }

  public async findOne(id?: string | number): Promise<ProgramEntity | undefined> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.id = :id').setParameter('id', id)

    return await qb.getOne();
  }

  public async findOneByUser(user: UserEntity, id: string | number): Promise<ProgramEntity | undefined> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.id = :id').setParameter('id', id)
      .andWhere('p.user = :user').setParameter('user', user.id)

    return await qb.getOne();
  }

  public async findOneByUserAndPath(user: UserEntity, path: string[]): Promise<ProgramEntity | undefined> {
    const level = path.length
    if (level === 0) {
      return undefined
    }

    let folder = undefined
    if (level > 1) {
      folder = await this.folderService.findOneByUserAndPath(user, path.slice(0, level - 1))
    }

    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.user = :user').setParameter('user', user.id)
      .andWhere('p.slug = :slug').setParameter('slug', path[level - 1])
      .orderBy('p.updated', 'DESC')

    if (folder) {
      qb.andWhere('p.folder = :folder').setParameter('folder', folder.id)
    } else {
      qb.andWhere('p.folder is NULL')
    }

    return await qb.getOne();
  }

  public async findLastPublic(limit?: number): Promise<ProgramEntity[]> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.public = :public').setParameter('public', true)
      .orderBy('p.updated', 'DESC')

    if (limit) {
      qb.limit(limit)
    }

    return await qb.getMany();
  }

  public async findLastByUserAndClient(user: UserEntity, client?: string): Promise<ProgramEntity[]> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.user = :user').setParameter('user', user.id)
      .orderBy('p.updated', 'DESC')

    if (client) {
      qb.leftJoin('p.client', 'c')
      qb.andWhere('c.name = :name').setParameter('name', client)
    }

    return await qb.getMany();
  }

  public async findLastByUserAndClientAndFolder(user: UserEntity, client?: string, folder?: FolderEntity): Promise<ProgramEntity[]> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.user = :user').setParameter('user', user.id)
      .orderBy('p.updated', 'DESC')
    
    if (client) {
      qb.leftJoin('p.client', 'c')
      qb.andWhere('c.name = :name').setParameter('name', client)
    }
    
    if (folder) {
      qb.andWhere('p.folder = :folder').setParameter('folder', folder.id)
    } else {
      qb.andWhere('p.folder is NULL')
    }
    
    return await qb.getMany();
  }

  public async findLastPublicByUserAndClient(user: UserEntity, client?: string): Promise<ProgramEntity[]> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.user = :user').setParameter('user', user.id)
      .andWhere('p.public = :public').setParameter('public', true)
      .orderBy('p.updated', 'DESC')

    if (client) {
      qb.leftJoin('p.client', 'c')
      qb.andWhere('c.name = :name').setParameter('name', client)
    }

    return await qb.getMany();
  }

  public async findLastPublicByUserAndClientAndFolder(user: UserEntity, client?: string, folder?: FolderEntity): Promise<ProgramEntity[]> {
    let qb = this.getProgramRepository().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.user = :user').setParameter('user', user.id)
      .andWhere('p.public = :public').setParameter('public', true)
      .orderBy('p.updated', 'DESC')

    if (client) {
      qb.leftJoin('p.client', 'c')
      qb.andWhere('c.name = :name').setParameter('name', client)
    }

    if (folder) {
      qb.andWhere('p.folder = :folder').setParameter('folder', folder.id)
    } else {
      qb.andWhere('p.folder is NULL')
    }

    return await qb.getMany();
  }
  
  public async generateUniqueSlug(user: UserEntity, slug: string): Promise<string> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    const program = await this.getProgramRepository().findOne({user, slug})
    if(program) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueSlug(user, `${slug}-${suffix}` )
    }
    
    return slug
  }

  public async isValid(program: ProgramEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(program: ProgramEntity): Promise<Object> {
    return {
      'id': program.id,
      'name': program.name,
      'slug': program.slug,
      'path': await this.folderService.toPath(program.folder),
      'clients': await this.programClientService.toClientNames(program),
      'tags': await this.programTagService.toTagNames(program),
      'description': program.description,
      'public': program.public,
      'created': program.created.toISOString(),
      'updated': program.updated.toISOString(),
    }
  }
}
