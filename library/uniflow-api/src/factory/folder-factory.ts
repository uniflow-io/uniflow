import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { FolderFactoryInterface } from './interfaces';
import { FolderEntity } from '../entity';

@Service()
export default class FolderFactory extends AbstractFactory<FolderEntity> implements FolderFactoryInterface {
}