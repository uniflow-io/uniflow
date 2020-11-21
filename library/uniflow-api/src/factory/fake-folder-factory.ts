import * as faker from 'faker'
import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { TypeModel } from '../model';
import FolderFactory from './folder-factory';

@Service()
export default class FakeFolderFactory extends FolderFactory {
    public create(entity?: FolderEntity|Object): FolderEntity {
        const folder = super.create(entity)
        folder.name = folder.name ?? faker.fake('Folder {{random.word}}')
        folder.slug = folder.slug ?? TypeModel.generateSlug(folder.name)

        return folder;
    }
}