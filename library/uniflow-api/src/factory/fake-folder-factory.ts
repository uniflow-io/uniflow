import * as faker from 'faker'
import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { TypeModel } from '../model';
import FolderFactory from './folder-factory';

@Service()
export default class FakeFolderFactory extends FolderFactory {
    public async create(entity?: FolderEntity|Object): Promise<FolderEntity> {
        const folder = await super.create(entity)
        folder.name = folder.name ?? faker.fake('Folder {{random.word}}')
        folder.slug = folder.slug ?? TypeModel.generateSlug(folder.name)

        return folder;
    }
}