import { Inject, Service } from 'typedi';
import { LeadEntity } from '../entity';
import { LeadFactory } from '../factory';
import { LeadRepository } from '../repository';
import { LeadSubscriberInterface, LeadSubscriberOptions } from './lead-subscriber/interfaces';

@Service()
export default class LeadService {
  constructor(
    private leadRepository: LeadRepository,
    @Inject('LeadSubscriberInterface')
    private leadSubscriber: LeadSubscriberInterface,
    private leadFactory: LeadFactory,
  ) {}
  
  public async subscribe(email: string, options: LeadSubscriberOptions): Promise<LeadEntity> {
    const lead = await this.leadFactory.create(await this.leadRepository.findOne({email}) || {email})

    const subscriberTypes: LeadSubscriberOptions = {types: []}
    for(const type in options.types) {
      if(type === 'newsletter' && !lead.optinNewsletter) {
        lead.optinNewsletter = true
        subscriberTypes.types.push(type)
      }
      if(type === 'blog' && !lead.optinBlog) {
        lead.optinBlog = true
        subscriberTypes.types.push(type)
      }
    }
    
    await this.leadSubscriber.subscribe(email, subscriberTypes)
    return await this.leadRepository.save(lead);
  }

  public async isValid(email: string): Promise<boolean> {
    return true
  }
  
  public async getJson(lead: LeadEntity): Promise<Object> {
    return {
      'email': lead.email,
    }
  }
}
