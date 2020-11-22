import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ProgramClientFactoryInterface } from './interfaces';
import { ProgramClientEntity } from '../entity';

@Service()
export default class ProgramClientFactory extends AbstractFactory<ProgramClientEntity> implements ProgramClientFactoryInterface {
}