import { Service } from 'typedi';
import { ProgramEntity, ProgramTagEntity } from '../entity';
import { ProgramTagFactory } from '../factory';
import { ProgramTagRepository } from '../repository';
import TagService from "./tag-service";

@Service()
export default class ProgramTagService {
  constructor(
    private programTagRepository: ProgramTagRepository,
    private tagService: TagService,
    private programTagFactory: ProgramTagFactory
  ) {}

  public async manageByProgramAndTagNames(program: ProgramEntity, names: string[]): Promise<ProgramTagEntity[]> {
    let programTags: ProgramTagEntity[] = []
    if(program.id) {
      programTags = await this.programTagRepository.findByProgram(program)
    }

    await this.programTagRepository.safeRemove(programTags)

    programTags = []

    const tags = await this.tagService.findOrCreateByNames(names)

    for(const tag of tags) {
      programTags.push(await this.programTagFactory.create({program, tag}));
    }

    return programTags
  }

  public async toTagNames(program: ProgramEntity): Promise<string[]> {
    let programTags: ProgramTagEntity[] = []
    if(program.id) {
      programTags = await this.programTagRepository.findByProgram(program)
    }

    return this.tagService.toNames(
      programTags.map((programTag) => {
        return programTag.tag
      })
    )
  }
}
