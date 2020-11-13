import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { FolderRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import { getTreeRepository } from 'typeorm';

@Service()
export default class FolderFixture implements FixtureInterface {
    constructor(
        private refs: ReferencesFixture,
        private folderRepository: FolderRepository,
    ) { }

    private async save(folder: FolderEntity): Promise<FolderEntity> {
        folder.slug = folder.name
        return await this.folderRepository.save(folder)
    }

    public async load() {
        let a = await this.save({
            name: 'a',
            user: this.refs.get('user-user@uniflow.io'),
        } as FolderEntity)

        let b = await this.save({
            name: 'b',
            user: this.refs.get('user-user@uniflow.io'),
        } as FolderEntity)

        let c = await this.save({
            name: 'c',
            user: this.refs.get('user-user@uniflow.io'),
            parent: b,
        } as FolderEntity)

        let d = await this.save({
            name: 'd',
            user: this.refs.get('user-user@uniflow.io'),
        } as FolderEntity)

        let e = await this.save({
            name: 'e',
            user: this.refs.get('user-user@uniflow.io'),
            parent: d,
        } as FolderEntity)

        await this.save({
            name: 'f',
            user: this.refs.get('user-user@uniflow.io'),
            parent: e,
        } as FolderEntity)
    }
}