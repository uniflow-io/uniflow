import { Service } from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Tag } from '../models';

@Service()
export default class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  public async save(tag: Tag): Promise<Tag> {
    return await this.tagRepository.save(tag);
  }

  public async clear(): Promise<Tag[]> {
    let qb = this.tagRepository.createQueryBuilder('t')
      .select('t')
      .leftJoinAndSelect('t.programs', 'pt')
      .andWhere('pt.program is NULL')
    
    return await this.tagRepository.remove(await qb.getMany())
  }
  
  public async findOne(id?: string | number): Promise<Tag | undefined> {
    return await this.tagRepository.findOne(id);
  }

  public async findOrCreateByNames(names: string[]): Promise<Tag[] | undefined> {
    let tags = []
    for(const name of names) {
      let tag = await this.tagRepository.findOne({name})
      if(!tag) {
        tag = new Tag()
        tag.name = name
        await this.save(tag)
      }

      tags.push(tag);
    }

    return tags
  }

  public async toNames(tags: Tag[]): Promise<string[] | undefined> {
    return tags.map((tag) => {
      return tag.name
    })
  }
}
