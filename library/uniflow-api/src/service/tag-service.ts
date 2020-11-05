import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { TagEntity } from '../entity';

@Service()
export default class TagService {
  private getTagRepository(): Repository<TagEntity> {
    return getRepository(TagEntity)
  }

  public async save(tag: TagEntity): Promise<TagEntity> {
    return await this.getTagRepository().save(tag);
  }

  public async clear(): Promise<TagEntity[]> {
    let qb = this.getTagRepository().createQueryBuilder('t')
      .select('t')
      .leftJoinAndSelect('t.programs', 'pt')
      .andWhere('pt.program is NULL')
    
    return await this.getTagRepository().remove(await qb.getMany())
  }
  
  public async findOne(id?: string | number): Promise<TagEntity | undefined> {
    return await this.getTagRepository().findOne(id);
  }

  public async findOrCreateByNames(names: string[]): Promise<TagEntity[]> {
    let tags = []
    for(const name of names) {
      let tag = await this.getTagRepository().findOne({name})
      if(!tag) {
        tag = new TagEntity()
        tag.name = name
        await this.save(tag)
      }

      tags.push(tag);
    }

    return tags
  }

  public async toNames(tags: TagEntity[]): Promise<string[]> {
    return tags.map((tag) => {
      return tag.name
    })
  }
}
