import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ProgramFactoryInterface } from './interfaces';
import { ProgramEntity } from '../entity';

@Service()
export default class ProgramFactory extends AbstractFactory<ProgramEntity> implements ProgramFactoryInterface {
    public create(entity?: ProgramEntity|Object): ProgramEntity {
        const program = super.create(entity)
        program.folder = program.folder ?? null

        return program;
    }
}