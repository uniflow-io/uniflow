import * as faker from 'faker'
import { Service } from 'typedi';
import { ProgramEntity } from '../entity';
import ProgramFactory from './program-factory';

@Service()
export default class FakeProgramFactory extends ProgramFactory {
    public create(entity?: ProgramEntity|Object): ProgramEntity {
        const program = super.create(entity)
        program.name = program.name ?? faker.random.word()
        program.description = program.description ?? faker.random.word()

        return program;
    }
}