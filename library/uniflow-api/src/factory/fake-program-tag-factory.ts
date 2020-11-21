import { Service } from 'typedi';
import ProgramTagFactory from './program-tag-factory';

@Service()
export default class FakeProgramTagFactory extends ProgramTagFactory {
}