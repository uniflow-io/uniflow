import { Service } from 'typedi';
import { LeadEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { LeadRepository } from '../repository';
import { FakeLeadFactory } from '../factory';
import ReferencesFixture from './references-fixture';

@Service()
export default class LeadFixture implements FixtureInterface {
    private leads: LeadEntity[]

    constructor(
        private refs: ReferencesFixture,
        private leadRepository: LeadRepository,
        private leadFactory: FakeLeadFactory,
    ) {
        this.leads = []
    }

    public get LEAD_KEYS():Array<string> {
        return this.leads.map(lead => `lead-${lead.email}`)
    }

    private async save(lead: LeadEntity): Promise<LeadEntity> {
        this.refs.set(`lead-${lead.email}`, lead);
        return await this.leadRepository.save(lead)
    }

    public async load() {
        for(let i = 0; i < 10; i++) {
            const lead = await this.leadFactory.create()
            this.leads.push(lead)
            await this.save(lead)
        }
    }
}