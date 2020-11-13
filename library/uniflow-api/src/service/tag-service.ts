import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { TagEntity } from '../entity';
import { TagRepository } from '../repository';

@Service()
export default class TagService {
  constructor(
    private tagRepository: TagRepository,
  ) {}
  
  public async findOne(id?: string | number): Promise<TagEntity | undefined> {
    return await this.tagRepository.findOne(id);
  }

  public async findOrCreateByNames(names: string[]): Promise<TagEntity[]> {
    let tags = []
    for(const name of names) {
      let tag = await this.tagRepository.findOne({name})
      if(!tag) {
        tag = new TagEntity()
        tag.name = name
        await this.tagRepository.save(tag)
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
