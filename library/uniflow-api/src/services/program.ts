import slugify from 'slugify'
import {Inject, Service} from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {Folder, Program, User} from '../models';
import { FolderService, ProgramClientService, ProgramTagService } from "./";

@Service()
export default class ProgramService {
  constructor(
    @InjectRepository(Program) private readonly programRepository: Repository<Program>,
    @Inject(type => FolderService) private readonly folderService: FolderService,
    @Inject(type => ProgramClientService) private readonly programClientService: ProgramClientService,
    @Inject(type => ProgramTagService) private readonly programTagService: ProgramTagService,
  ) {}

  public async save(program: Program): Promise<Program> {
    return await this.programRepository.save(program);
  }
  
  public async remove(program: Program): Promise<Program> {
    return await this.programRepository.remove(program);
  }

  public async findOne(id?: string | number): Promise<Program | undefined> {
    let qb = this.programRepository.createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.id = :id').setParameter('id', id)

    return await qb.getOne();
  }

  public async findOneByUser(user: User, id: string | number): Promise<Program | undefined> {
    let qb = this.programRepository.createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.id = :id').setParameter('id', id)
      .andWhere('p.user = :user').setParameter('user', user.id)

    return await qb.getOne();
  }

  public async findOneByUserAndPath(user: User, path: string[]): Promise<Program | undefined> {
    const level = path.length
    if (level === 0) {
      return undefined
    }

    let folder = undefined
    if (level > 1) {
      folder = await this.folderService.findOneByUserAndPath(user, path.slice(0, level - 1))
    }

    let qb = this.programRepository.createQueryBuilder('p')
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

  public async findLastPublic(limit?: number): Promise<Program[]> {
    let qb = this.programRepository.createQueryBuilder('p')
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

  public async findLastByUserAndClient(user: User, client?: string): Promise<Program[]> {
    let qb = this.programRepository.createQueryBuilder('p')
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

  public async findLastByUserAndClientAndFolder(user: User, client?: string, folder?: Folder): Promise<Program[]> {
    let qb = this.programRepository.createQueryBuilder('p')
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

  public async findLastPublicByUserAndClient(user: User, client?: string): Promise<Program[]> {
    let qb = this.programRepository.createQueryBuilder('p')
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

  public async findLastPublicByUserAndClientAndFolder(user: User, client?: string, folder?: Folder): Promise<Program[]> {
    let qb = this.programRepository.createQueryBuilder('p')
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
  
  public async generateUniqueSlug(user: User, slug: string): Promise<string> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    const program = await this.programRepository.findOne({user, slug})
    if(program) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueSlug(user, `${slug}-${suffix}` )
    }
    
    return slug
  }

  public async isValid(program: Program): Promise<boolean> {
    return true
  }
  
  public async getJson(program: Program): Promise<Object> {
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
