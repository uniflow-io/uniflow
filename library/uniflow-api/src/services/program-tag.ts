import { Service, Container } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import { Program, ProgramTag } from '../entities';
import TagService from "./tag";

@Service()
export default class ProgramTagService {
  private programTagRepository: Repository<ProgramTag>;
  private tagService: TagService;

  constructor() {
    this.programTagRepository = getRepository(ProgramTag)
    this.tagService = Container.get(TagService)
  }

  public async save(programTag: ProgramTag): Promise<ProgramTag> {
    return await this.programTagRepository.save(programTag);
  }

  public async findOne(id?: string | number): Promise<ProgramTag | undefined> {
    return await this.programTagRepository.findOne(id);
  }

  public async manageByProgramAndTagNames(program: Program, names: string[]): Promise<ProgramTag[]> {
    let programTags: ProgramTag[] = []
    if(program.id) {
      let qb = this.programTagRepository.createQueryBuilder('pt')
        .select('pt')
        .leftJoinAndSelect('pt.program', 'p')
        .leftJoinAndSelect('pt.tag', 'c')
        .andWhere('pt.program = :program').setParameter('program', program.id)

      programTags = await qb.getMany();
    }

    await this.programTagRepository.remove(programTags)

    programTags = []

    const tags = await this.tagService.findOrCreateByNames(names)

    for(const tag of tags) {
      const programTag = new ProgramTag()
      programTag.program = program
      programTag.tag = tag

      programTags.push(programTag);
    }

    return programTags
  }

  public async toTagNames(program: Program): Promise<string[]> {
    let programTags: ProgramTag[] = []
    if(program.id) {
      let qb = this.programTagRepository.createQueryBuilder('pt')
        .select('pt')
        .leftJoinAndSelect('pt.program', 'p')
        .leftJoinAndSelect('pt.tag', 'c')
        .andWhere('pt.program = :program').setParameter('program', program.id)

      programTags = await qb.getMany();
    }

    return this.tagService.toNames(
      programTags.map((programTag) => {
        return programTag.tag
      })
    )
  }
}
