import slugify from 'slugify'
import { Service } from 'typedi';
import { IsNull } from 'typeorm';
import { FolderEntity, ProgramEntity, UserEntity } from '../entity';
import { ApiException } from '../exception';
import { TypeCheckerModel } from '../model';
import { FolderRepository, ProgramRepository } from '../repository';

@Service()
export default class FolderService {
  constructor(
    private folderRepository: FolderRepository,
    private programRepository: ProgramRepository,
  ) {}

  public async toPath(folder?: FolderEntity): Promise<string> {
    let paths = []
    
    while(folder) {
      paths.unshift(folder.slug)
      
      folder = await this.folderRepository.findOneParent(folder)
    }
    
    return `/${paths.join('/')}`
  }

  public async fromPath(user: UserEntity, path: string): Promise<FolderEntity|undefined> {
    if(!TypeCheckerModel.isPath(path)) {
      throw new ApiException('not a path')
    }

    const paths = path === '/' ? [] : path.split('/').slice(1)
    return await this.folderRepository.findOneByUserAndPath(user, paths)
  }
  
  public async setSlug(entity: FolderEntity | ProgramEntity, slug: string): Promise<FolderEntity | ProgramEntity> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    let parent = undefined
    if(entity instanceof FolderEntity) {
      parent = entity.parent
    } else if(entity instanceof ProgramEntity) {
      parent = entity.folder
    }

    const folder = await this.folderRepository.findOne({user: entity.user, parent: parent ? parent : IsNull(), slug})
    const program = await this.programRepository.findOne({user: entity.user, folder: parent ? parent : IsNull(), slug})
    if(folder || program) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.setSlug(entity, `${slug}-${suffix}`)
    }

    entity.slug = slug
    
    return entity
  }

  public async isValid(folder: FolderEntity): Promise<boolean> {
    let isValid = true
    isValid &&= folder.name !== undefined
    isValid &&= folder.name !== ''
    return isValid
  }
  
  public async getJson(folder: FolderEntity): Promise<Object> {
    return {
      'uid': folder.uid,
      'name': folder.name,
      'slug': folder.slug,
      'path': await this.toPath(folder.parent),
      'user': folder.user.username || folder.user.uid,
      'created': folder.created.toISOString(),
      'updated': folder.updated.toISOString(),
    }
  }
}
