import * as faker from 'faker'
import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { FolderRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import UserFixture from './user-fixture';
import { FakeFolderFactory } from '../factory';

@Service()
export default class FolderFixture implements FixtureInterface {
    private folders: FolderEntity[]

    constructor(
        private refs: ReferencesFixture,
        private folderRepository: FolderRepository,
        private userFixture: UserFixture,
        private folderFactory: FakeFolderFactory,
    ) {
        this.folders = []
    }

    public get FOLDER_KEYS():Array<string> {
        return this.folders.map(folder => `folder-${folder.user.email}-${folder.slug}`)
    }

    private async save(folder: FolderEntity): Promise<FolderEntity> {
        this.refs.set(`folder-${folder.user.email}-${folder.slug}`, folder);
        return await this.folderRepository.save(folder)
    }

    public async load() {
        for(const userKey of this.userFixture.USER_KEYS) {
            const parents: Array<FolderEntity|undefined> = [undefined]
            for(let i = 0; i < 10; i++) {
                const folder = this.folderFactory.create({
                    user: this.refs.get(userKey),
                    parent: faker.random.arrayElement(parents),
                })
                this.folders.push(folder)
                parents.push(folder)
                await this.save(folder)
            }
        }
    }
}