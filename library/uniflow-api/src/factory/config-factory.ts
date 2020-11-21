import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ConfigFactoryInterface } from './interfaces';
import { ConfigEntity } from '../entity';

@Service()
export default class ConfigFactory extends AbstractFactory<ConfigEntity> implements ConfigFactoryInterface {
}