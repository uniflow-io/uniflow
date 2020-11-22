import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ProgramTagFactoryInterface } from './interfaces';
import { ProgramTagEntity } from '../entity';

@Service()
export default class ProgramTagFactory extends AbstractFactory<ProgramTagEntity> implements ProgramTagFactoryInterface {
}