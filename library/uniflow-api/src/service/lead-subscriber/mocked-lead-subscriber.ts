import { Service } from 'typedi';
import { LeadEntity } from '../../entity';
import { LeadSubscriberInterface } from './interfaces';

@Service()
export default class MockedLeadSubscriber implements LeadSubscriberInterface {
  public async subscribe(lead: LeadEntity): Promise<any> {
  }

  public async sync(): Promise<any> {
  }
}
