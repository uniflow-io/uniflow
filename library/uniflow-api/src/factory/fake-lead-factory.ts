import * as faker from 'faker'
import { Service } from 'typedi';
import { LeadEntity } from '../entity';
import LeadFactory from './lead-factory';

@Service()
export default class FakeLeadFactory extends LeadFactory {
    public async create(entity?: LeadEntity|Object): Promise<LeadEntity> {
        const lead = await super.create(entity)
        lead.email = lead.email ?? faker.internet.email()
        lead.optinNewsletter = lead.optinNewsletter ?? faker.random.boolean()
        lead.optinBlog = lead.optinBlog ?? faker.random.boolean()

        return lead;
    }
}