import slugify from 'slugify'
import { Service } from 'typedi';
import { FolderEntity, UserEntity } from '../entity';
import { FolderRepository } from '../repository';

@Service()
export default class FolderService {
  constructor(
    private folderRepository: FolderRepository,
  ) {}

  public async toPath(folder?: FolderEntity): Promise<string[]> {
    let path = []
    
    while(folder) {
      path.unshift(folder.slug)
      
      folder = await this.folderRepository.findOneParent(folder)
    }
    
    return path
  }
  
  public async generateUniqueSlug(user: UserEntity, slug: string): Promise<string> {
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
