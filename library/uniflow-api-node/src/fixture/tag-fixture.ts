import { Service } from 'typedi';
import { TagEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { TagRepository } from '../repository';
import { FakeTagFactory } from '../factory';
import ReferencesFixture from './references-fixture';

@Service()
export default class TagFixture implements FixtureInterface {
    private tags: TagEntity[]

    constructor(
        private refs: ReferencesFixture,
        private tagRepository: TagRepository,
        private tagFactory: FakeTagFactory,
    ) {
        this.tags = []
    }

    public get TAG_KEYS():Array<string> {
        return this.tags.map(tag => `tag-${tag.name}`)
    }

    private async save(tag: TagEntity): Promise<TagEntity> {
        this.refs.set(`tag-${tag.name}`, tag);
        return await this.tagRepository.save(tag)
    }

    public async load() {
        for(let i = 0; i < 10; i++) {
            const tag = await this.tagFactory.create()
            if(this.tags.filter(exitingTag => exitingTag.name === tag.name).length === 0) {
                this.tags.push(tag)
                await this.save(tag)
            }
        }
    }
}