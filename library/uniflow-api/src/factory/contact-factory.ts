import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ContactFactoryInterface } from './interfaces';
import { ContactEntity } from '../entity';

@Service()
export default class ContactFactory extends AbstractFactory<ContactEntity> implements ContactFactoryInterface {
}