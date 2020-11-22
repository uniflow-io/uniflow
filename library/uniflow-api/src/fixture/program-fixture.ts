import * as faker from 'faker'
import { Service } from 'typedi';
import { ObjectLiteral } from 'typeorm';
import { FolderEntity, ProgramClientEntity, ProgramEntity, ProgramTagEntity, UserEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { ProgramRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import ClientFixture from './client-fixture';
import UserFixture from './user-fixture';
import TagFixture from './tag-fixture';
import FolderFixture from './folder-fixture';
import { TypeModel } from '../model';
import { FakeProgramFactory } from '../factory';

@Service()
export default class ProgramFixture implements FixtureInterface {
    constructor(
        private refs: ReferencesFixture,
        private programRepository: ProgramRepository,
        private userFixture: UserFixture,
        private clientFixture: ClientFixture,
        private tagFixture: TagFixture,
        private folderFixture: FolderFixture,
        private programFactory: FakeProgramFactory,
    ) { }

    private async save(program: ProgramEntity): Promise<ProgramEntity> {
        program.slug = TypeModel.generateSlug(program.name)

        return await this.programRepository.save(program)
    }

    public async load() {
        const users = this.userFixture.USER_KEYS.map(key => this.refs.get(key))
        const clients = this.clientFixture.CLIENT_KEYS.map(key => this.refs.get(key))
        const tags = this.tagFixture.TAG_KEYS.map(key => this.refs.get(key))
        const folders = users.reduce<Map<string,Array<ObjectLiteral|undefined>>>((folders, user: UserEntity) => {
            return folders.set(user.email, [
                ...[undefined],
                ...this.folderFixture.FOLDER_KEYS
                    .map(key => this.refs.get(key))
                    .filter((folder: FolderEntity) => folder.user.email === user.email)
            ])
        }, new Map())

        for(let i = 0; i < 512; i++) {
            const user = faker.random.arrayElement(users)
            const userFolders: Array<ObjectLiteral|undefined> = folders.get(user?.email) || []
            const folder = faker.random.arrayElement<ObjectLiteral | undefined>(userFolders)

            await this.save(await this.programFactory.create({
                user: user,
                folder: folder,
                clients: faker.random.arrayElements(clients).map(client => ({
                    client: client
                } as ProgramClientEntity)),
                tags: faker.random.arrayElements(tags).map(tag => ({
                    tag: tag
                } as ProgramTagEntity)),
                public: faker.random.boolean(),
            }))
        }
    }
}