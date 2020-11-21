import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ProgramFactoryInterface } from './interfaces';
import { ProgramEntity } from '../entity';

@Service()
export default class ProgramFactory extends AbstractFactory<ProgramEntity> implements ProgramFactoryInterface {
}