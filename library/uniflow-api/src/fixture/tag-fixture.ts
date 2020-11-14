import { Service } from 'typedi';
import { TagEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { TagRepository } from '../repository';
import ReferencesFixture from './references-fixture';

@Service()
export default class TagFixture implements FixtureInterface {
    public static get TAGS():Array<string> {
        return Array.from(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(tag => `tag-${tag}`))
    }

    constructor(
        private refs: ReferencesFixture,
        private tagRepository: TagRepository,
    ) { }

    private async save(tag: TagEntity): Promise<TagEntity> {
        this.refs.set(`tag-${tag.name}`, tag);
        return await this.tagRepository.save(tag)
    }

    public async load() {
        for(const tag of TagFixture.TAGS) {
            await this.save({
                name: tag,
            } as TagEntity)
        }
    }
}