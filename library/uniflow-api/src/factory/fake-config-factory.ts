import { Service } from 'typedi';
import ConfigFactory from './config-factory';

@Service()
export default class FakeConfigFactory extends ConfigFactory {
}