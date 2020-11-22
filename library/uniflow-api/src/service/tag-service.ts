import { Service } from 'typedi';
import { TagEntity } from '../entity';
import { TagFactory } from '../factory';
import { TagRepository } from '../repository';

@Service()
export default class TagService {
  constructor(
    private tagRepository: TagRepository,
    private tagFactory: TagFactory,
  ) {}

  public async findOrCreateByNames(names: string[]): Promise<TagEntity[]> {
    let tags = []
    for(const name of names) {
      let tag = await this.tagRepository.findOne({name})
      if(!tag) {
        tag = await this.tagFactory.create({name})
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
