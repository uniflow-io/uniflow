import * as faker from 'faker'
import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { FolderRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import UserFixture from './user-fixture';

@Service()
export default class FolderFixture implements FixtureInterface {
    public static get FOLDERS():Array<string> {
        return Array.from(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(tag => `folder-${tag}`))
    }

    constructor(
        private refs: ReferencesFixture,
        private folderRepository: FolderRepository,
    ) { }

    private async save(folder: FolderEntity): Promise<FolderEntity> {
        folder.slug = folder.name
        
        this.refs.set(`folder-${folder.user.email}-${folder.name}`, folder);
        return await this.folderRepository.save(folder)
    }

    public async load() {
        for(const user of UserFixture.USERS) {
            const parents: Array<FolderEntity|undefined> = [undefined]
            for(const folder of FolderFixture.FOLDERS) {
                const folderEntity = await this.save({
                    name: folder,
                    user: this.refs.get(`user-${user}`),
                    parent: faker.random.arrayElement(parents),
                } as FolderEntity)
                parents.push(folderEntity)
            }
        }
    }
}