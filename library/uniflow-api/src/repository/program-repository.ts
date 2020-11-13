import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { FolderEntity, ProgramEntity, UserEntity} from '../entity';
import AbstractRepository from './abstract-repository';

@Service()
export default class ProgramRepository extends AbstractRepository<ProgramEntity> {
  getRepository<ProgramEntity>(): Repository<ProgramEntity> {
    return getRepository<ProgramEntity>(ProgramEntity)
  }

  public async findOne(id?: any): Promise<ProgramEntity | undefined> {
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.id = :id').setParameter('id', id)

    return await qb.getOne();
  }

  public async findOneByUser(user: UserEntity, id: string | number): Promise<ProgramEntity | undefined> {
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.id = :id').setParameter('id', id)
      .andWhere('p.user = :user').setParameter('user', user.id)

    return await qb.getOne();
  }

  public async findOneByUserAndSlug(user: UserEntity, slug: string, folder?: FolderEntity): Promise<ProgramEntity | undefined> {
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
      .select('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.folder', 'f')
      .andWhere('p.user = :user').setParameter('user', user.id)
      .andWhere('p.slug = :slug').setParameter('slug', slug)
      .orderBy('p.updated', 'DESC')

    if (folder) {
      qb.andWhere('p.folder = :folder').setParameter('folder', folder.id)
    } else {
      qb.andWhere('p.folder is NULL')
    }

    return await qb.getOne();
  }

  public async findPublic(limit?: number): Promise<ProgramEntity[]> {
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
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
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
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
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
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
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
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
    const qb = this.getRepository<ProgramEntity>().createQueryBuilder('p')
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
}
