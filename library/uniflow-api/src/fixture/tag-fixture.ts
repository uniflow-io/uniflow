import { Service } from 'typedi';
import { TagEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { TagRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import { FakeTagFactory } from '../factory';

@Service()
export default class TagFixture implements FixtureInterface {
    private tags: TagEntity[]

    constructor(
        private refs: ReferencesFixture,
        private tagRepository: TagRepository,
        private tagFactory: FakeTagFactory,
    ) {
        this.tags = []
        for(let i = 0; i < 10; i++) {
            this.tags.push(this.tagFactory.create())
        }
    }

    public get TAG_KEYS():Array<string> {
        return this.tags.map(tag => `tag-${tag.name}`)
    }

    private async save(tag: TagEntity): Promise<TagEntity> {
        this.refs.set(`tag-${tag.name}`, tag);
        return await this.tagRepository.save(tag)
    }

    public async load() {
        for(const tag of this.tags) {
            await this.save(tag)
        }
    }
}