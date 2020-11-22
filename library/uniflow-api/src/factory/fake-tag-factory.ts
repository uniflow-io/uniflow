import * as faker from 'faker'
import { Service } from 'typedi';
import { TagEntity } from '../entity';
import TagFactory from './tag-factory';

@Service()
export default class FakeTagFactory extends TagFactory {
    public async create(entity?: TagEntity|Object): Promise<TagEntity> {
        const tag = await super.create(entity)
        tag.name = tag.name ?? faker.fake('Tag {{random.word}}')

        return tag;
    }
}