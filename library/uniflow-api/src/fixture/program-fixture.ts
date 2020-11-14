import * as faker from 'faker'
import { Service } from 'typedi';
import { ObjectLiteral } from 'typeorm';
import { ProgramClientEntity, ProgramEntity, ProgramTagEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { ProgramRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import ClientFixture from './client-fixture';
import UserFixture from './user-fixture';
import TagFixture from './tag-fixture';
import FolderFixture from './folder-fixture';

@Service()
export default class ProgramFixture implements FixtureInterface {
    constructor(
        private refs: ReferencesFixture,
        private programRepository: ProgramRepository,
    ) { }

    private async save(program: ProgramEntity): Promise<ProgramEntity> {
        program.slug = faker.helpers.slugify(program.name).toLowerCase()

        return await this.programRepository.save(program)
    }

    public async load() {
        const users = UserFixture.USERS.map(user => this.refs.get(`user-${user}`))
        const clients = ClientFixture.CLIENTS.map(client => this.refs.get(`client-${client}`))
        const tags = TagFixture.TAGS.map(tag => this.refs.get(`tag-${tag}`))
        const folders = UserFixture.USERS.reduce<Map<string,Array<ObjectLiteral|undefined>>>((folders, user) => {
            return folders.set(user, [...[undefined], ...FolderFixture.FOLDERS.map(folder => this.refs.get(`folder-${user}-${folder}`))])
        }, new Map())

        for(let i = 0; i < 512; i++) {
            const user = faker.random.arrayElement(users)
            const userFolders: Array<ObjectLiteral|undefined> = folders.get(user?.email) || []
            const folder = faker.random.arrayElement<ObjectLiteral | undefined>(userFolders)

            await this.save({
                name: faker.random.word(),
                description: faker.random.words(),
                user: user,
                folder: folder,
                clients: faker.random.arrayElements(clients).map(client => ({
                    client: client
                } as ProgramClientEntity)),
                tags: faker.random.arrayElements(tags).map(tag => ({
                    tag: tag
                } as ProgramTagEntity)),
                public: faker.random.boolean(),
            } as ProgramEntity)
        }
    }
}