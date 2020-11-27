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
    let lead = await this.leadFactory.create(await this.leadRepository.findOne({email}) || {email})

    for(const type of options.types) {
      if(type === 'newsletter' && !lead.optinNewsletter) {
        lead.optinNewsletter = true
      }
      if(type === 'blog' && !lead.optinBlog) {
        lead.optinBlog = true
      }
    }

    lead = await this.leadRepository.save(lead)
    await this.leadSubscriber.subscribe(lead)
    return lead
  }

  public async isValid(email: string): Promise<boolean> {
    return true
  }
  
  public async getJson(lead: LeadEntity): Promise<Object> {
    return {
      'email': lead.email,
      'optinNewsletter': lead.optinNewsletter,
      'optinBlog': lead.optinBlog,
    }
  }
}
