import * as faker from 'faker'
import { Service } from 'typedi';
import { TagEntity } from '../entity';
import TagFactory from './tag-factory';

@Service()
export default class FakeTagFactory extends TagFactory {
    public create(entity?: TagEntity|Object): TagEntity {
        const tag = super.create(entity)
        tag.name = tag.name ?? faker.fake('Tag {{random.word}}')

        return tag;
    }
}