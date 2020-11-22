import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ClientFactoryInterface } from './interfaces';
import { ClientEntity } from '../entity';

@Service()
export default class ClientFactory extends AbstractFactory<ClientEntity> implements ClientFactoryInterface {
}