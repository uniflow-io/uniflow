import { Service } from 'typedi';
import ProgramClientFactory from './program-client-factory';

@Service()
export default class FakeProgramClientFactory extends ProgramClientFactory {
}