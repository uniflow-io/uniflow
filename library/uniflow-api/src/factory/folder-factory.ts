import { Service } from 'typedi';
import { FolderEntity } from '../entity';
import { FolderFactoryInterface } from './interfaces';
import AbstractFactory from './abstract-factory';

@Service()
export default class FolderFactory extends AbstractFactory<FolderEntity> implements FolderFactoryInterface {
    public create(entity?: FolderEntity|Object): FolderEntity {
        const folder = super.create(entity)
        folder.parent = folder.parent ?? null

        return folder;
    }
}