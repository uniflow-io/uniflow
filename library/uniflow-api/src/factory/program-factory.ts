import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { ProgramFactoryInterface } from './interfaces';
import { ProgramEntity } from '../entity';

@Service()
export default class ProgramFactory extends AbstractFactory<ProgramEntity> implements ProgramFactoryInterface {
    public async create(entity?: ProgramEntity|Object): Promise<ProgramEntity> {
        const program = await super.create(entity)
        program.folder = program.folder ?? null

        return program;
    }
}