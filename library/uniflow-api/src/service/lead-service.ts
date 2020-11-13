import { Inject, Service } from 'typedi';
import { LeadEntity } from '../entity';
import { LeadRepository } from '../repository';
import { LeadSubscriberInterface, LeadSubscriberOptions } from './lead-subscriber/interfaces';

@Service()
export default class LeadService {
  constructor(
    private leadRepository: LeadRepository,
    @Inject('LeadSubscriberInterface')
    private leadSubscriber: LeadSubscriberInterface
  ) {}
  
  public async create(email: string, options: LeadSubscriberOptions): Promise<LeadEntity> {
    let lead = await this.leadRepository.findOne({email})
    if(!lead) {
      lead = new LeadEntity()
      lead.email = email
    }

    if(options.type === 'newsletter' && !lead.optinNewsletter) {
      await this.leadSubscriber.subscribe(email, options)
      lead.optinNewsletter = true
    }

    return await this.leadRepository.save(lead);
  }

  public async isValid(email: string): Promise<boolean> {
    return true
  }
  
  public async getJson(lead: LeadEntity): Promise<Object> {
    return {
      'email': lead.email,
      'created': lead.created.toISOString(),
      'updated': lead.updated.toISOString(),
    }
  }
}
