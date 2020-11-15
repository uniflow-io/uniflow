import slugify from 'slugify'
import { Service } from 'typedi';
import { FolderEntity, UserEntity } from '../entity';
import { ApiException } from '../exception';
import { TypeChecker } from '../model';
import { FolderRepository, ProgramRepository } from '../repository';

@Service()
export default class FolderService {
  constructor(
    private folderRepository: FolderRepository,
    private programRepository: ProgramRepository,
  ) {}

  public async delete(folder: FolderEntity): Promise<FolderEntity> {
    const folderChildren = await this.folderRepository.find({parent: folder})
    for(const folderChild of folderChildren) {
      await this.delete(folderChild)
    }

    const programs = await this.programRepository.find({folder: folder})
    for(const program of programs) {
      this.programRepository.remove(program)
    }
    
    return await this.folderRepository.remove(folder)
  }

  public async toPath(folder?: FolderEntity): Promise<string> {
    let paths = []
    
    while(folder) {
      paths.unshift(folder.slug)
      
      folder = await this.folderRepository.findOneParent(folder)
    }
    
    return `/${paths.join('/')}`
  }

  public async fromPath(user: UserEntity, path: string): Promise<FolderEntity|undefined> {
    if(!TypeChecker.isPath(path)) {
      throw new ApiException('not a path')
    }

    const paths = path === '/' ? [] : path.split('/').slice(1)
    return await this.folderRepository.findOneByUserAndPath(user, paths)
  }
  
  public async generateUniqueSlug(slug: string, user: UserEntity, parent?: FolderEntity): Promise<string> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    const folder = await this.folderRepository.findOne({user, parent, slug})
    const program = await this.programRepository.findOne({user, folder: parent, slug})
    if(folder || program) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueSlug(`${slug}-${suffix}`, user, parent)
    }
    
    return slug
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
