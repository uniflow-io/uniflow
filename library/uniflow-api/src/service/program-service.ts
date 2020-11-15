import slugify from 'slugify'
import { Service } from 'typedi';
import { FolderEntity, ProgramEntity, UserEntity} from '../entity';
import { ProgramRepository } from '../repository';
import FolderService from './folder-service'
import ProgramClientService from './program-client-service'
import ProgramTagService from './program-tag-service'

@Service()
export default class ProgramService {
  constructor(
    private programRepository: ProgramRepository,
    private folderService: FolderService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
  ) {}
  
  public async generateUniqueSlug(user: UserEntity, slug: string, folder?: FolderEntity): Promise<string> {
    slug = slugify(slug, {
      replacement: '-',
      lower: true,
      strict: true,
    })
    
    const program = await this.programRepository.findOne({user, folder, slug})
    if(program) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueSlug(user, `${slug}-${suffix}`, folder)
    }
    
    return slug
  }

  public async isValid(program: ProgramEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(program: ProgramEntity): Promise<Object> {
    return {
      'uid': program.uid,
      'name': program.name,
      'slug': program.slug,
      'path': await this.folderService.toPath(program.folder),
      'clients': await this.programClientService.toClientNames(program),
      'tags': await this.programTagService.toTagNames(program),
      'description': program.description,
      'public': program.public,
      'user': program.user.username || program.user.uid,
      'created': program.created.toISOString(),
      'updated': program.updated.toISOString(),
    }
  }
}
