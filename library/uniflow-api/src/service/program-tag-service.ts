import { Service } from 'typedi';
import { ProgramEntity, ProgramTagEntity } from '../entity';
import { ProgramTagRepository } from '../repository';
import { TagService } from "../service";

@Service()
export default class ProgramTagService {
  constructor(
    private programTagRepository: ProgramTagRepository,
    private tagService: TagService
  ) {}

  public async manageByProgramAndTagNames(program: ProgramEntity, names: string[]): Promise<ProgramTagEntity[]> {
    let programTags: ProgramTagEntity[] = []
    if(program.id) {
      programTags = await this.programTagRepository.findByProgram(program)
    }

    await this.programTagRepository.remove(programTags)

    programTags = []

    const tags = await this.tagService.findOrCreateByNames(names)

    for(const tag of tags) {
      const programTag = new ProgramTagEntity()
      programTag.program = program
      programTag.tag = tag

      programTags.push(programTag);
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
