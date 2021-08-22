import { Service } from 'typedi';
import { ProgramEntity } from '../entity';
import { ProgramApiType } from '../model/interfaces';
import FolderService from './folder-service'
import ProgramClientService from './program-client-service'
import ProgramTagService from './program-tag-service'

@Service()
export default class ProgramService {
  constructor(
    private folderService: FolderService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
  ) {}

  public async isValid(program: ProgramEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(program: ProgramEntity): Promise<ProgramApiType> {
    return {
      uid: program.uid,
      name: program.name,
      slug: program.slug,
      path: await this.folderService.toPath(program.folder || undefined),
      clients: await this.programClientService.toClientNames(program),
      tags: await this.programTagService.toTagNames(program),
      description: program.description,
      isPublic: program.isPublic,
      user: program.user.username || program.user.uid,
      created: program.created,
      updated: program.updated,
    }
  }
}
