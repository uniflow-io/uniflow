import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { FolderFactoryInterface } from './interfaces';
import AbstractFactory from './abstract-factory';

@Service()
export default class FolderFactory extends AbstractFactory<FolderEntity> implements FolderFactoryInterface {
    public async create(entity?: FolderEntity|Object): Promise<FolderEntity> {
        const folder = await super.create(entity)
        folder.parent = folder.parent ?? null

        return folder;
    }
}