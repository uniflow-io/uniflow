import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { LeadFactoryInterface } from './interfaces';
import { LeadEntity } from '../entity';

@Service()
export default class LeadFactory extends AbstractFactory<LeadEntity> implements LeadFactoryInterface {
}