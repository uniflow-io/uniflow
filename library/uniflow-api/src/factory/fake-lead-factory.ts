import { Service } from 'typedi';
import LeadFactory from './lead-factory';

@Service()
export default class FakeLeadFactory extends LeadFactory {
}