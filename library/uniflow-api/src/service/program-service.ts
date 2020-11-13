import slugify from 'slugify'
import { Service } from 'typedi';
import { ProgramEntity, UserEntity} from '../entity';
import { FolderRepository, ProgramRepository } from '../repository';
import { FolderService, ProgramClientService, ProgramTagService } from "../service";

@Service()
export default class ProgramService {
  constructor(
    private programRepository: ProgramRepository,
    private folderRepository: FolderRepository,
    private folderService: FolderService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
  ) {}

  public async findOneByUserAndPath(user: UserEntity, path: string[]): Promise<ProgramEntity | undefined> {
    const level = path.length
    if (level === 0) {
      return undefined
    }

    let folder = undefined
    if (level > 1) {
      folder = await this.folderRepository.findOneByUserAndPath(user, path.slice(0, level - 1))
    }

    return await this.programRepository.findOneByUserAndSlug(user, path[level - 1], folder)
  }
  
  public async generateUniqueSlug(user: UserEntity, slug: string): Promise<string> {
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
      'created': program.created.toISOString(),
      'updated': program.updated.toISOString(),
    }
  }
}
