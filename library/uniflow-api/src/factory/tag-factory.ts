import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { TagFactoryInterface } from './interfaces';
import { TagEntity } from '../entity';

@Service()
export default class TagFactory extends AbstractFactory<TagEntity> implements TagFactoryInterface {
}