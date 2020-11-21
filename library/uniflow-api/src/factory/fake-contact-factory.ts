import { Service } from 'typedi';
import ContactFactory from './contact-factory';

@Service()
export default class FakeContactFactory extends ContactFactory {
}