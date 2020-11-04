import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ProgramEntity, ProgramTagEntity } from '../entities';
import { TagService } from ".";

@Service()
export default class ProgramTagService {
  constructor(
    private tagService: TagService
  ) {}
  
  private getProgramTagRepository(): Repository<ProgramTagEntity> {
    return getRepository(ProgramTagEntity)
  }

  public async save(programTag: ProgramTagEntity): Promise<ProgramTagEntity> {
    return await this.getProgramTagRepository().save(programTag);
  }

  public async findOne(id?: string | number): Promise<ProgramTagEntity | undefined> {
    return await this.getProgramTagRepository().findOne(id);
  }

  public async manageByProgramAndTagNames(program: ProgramEntity, names: string[]): Promise<ProgramTagEntity[]> {
    let programTags: ProgramTagEntity[] = []
    if(program.id) {
      let qb = this.getProgramTagRepository().createQueryBuilder('pt')
        .select('pt')
        .leftJoinAndSelect('pt.program', 'p')
        .leftJoinAndSelect('pt.tag', 'c')
        .andWhere('pt.program = :program').setParameter('program', program.id)

      programTags = await qb.getMany();
    }

    await this.getProgramTagRepository().remove(programTags)

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
      let qb = this.getProgramTagRepository().createQueryBuilder('pt')
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
