import { Inject, Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { LeadEntity } from '../entity';
import { LeadSubscriberInterface, LeadSubscriberOptions } from './lead-subscriber/interfaces';

@Service()
export default class LeadService {
  constructor(
    @Inject('LeadSubscriberInterface')
    private leadSubscriber: LeadSubscriberInterface
  ) {}

  private getLeadRepository(): Repository<LeadEntity> {
    return getRepository(LeadEntity)
  }

  public async save(lead: LeadEntity): Promise<LeadEntity> {
    return await this.getLeadRepository().save(lead);
  }
  
  public async create(email: string, options: LeadSubscriberOptions): Promise<LeadEntity> {
    let lead = await this.findOneByEmail(email)
    if(!lead) {
      lead = new LeadEntity()
      lead.email = email
    }

    if(options.type === 'newsletter' && !lead.optinNewsletter) {
      await this.leadSubscriber.subscribe(email, options)
      lead.optinNewsletter = true
    }

    return await this.getLeadRepository().save(lead);
  }

  public async findOneByEmail(email: string): Promise<LeadEntity | undefined> {
    let qb = this.getLeadRepository().createQueryBuilder('l')
      .select('l')
      .andWhere('l.email = :email').setParameter('email', email)

    return await qb.getOne();
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
