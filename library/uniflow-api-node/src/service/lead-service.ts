import { Service } from 'typedi';
import { LeadEntity } from '../entity';
import { LeadApiType } from '../model/interfaces';

@Service()
export default class LeadService {
  public async isValid(lead: LeadEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(lead: LeadEntity): Promise<LeadApiType> {
    return {
      uid: lead.uid,
      email: lead.email,
      optinNewsletter: lead.optinNewsletter,
      optinBlog: lead.optinBlog,
      optinGithub: lead.optinGithub,
      githubUsername: lead.githubUsername,
    }
  }
}
