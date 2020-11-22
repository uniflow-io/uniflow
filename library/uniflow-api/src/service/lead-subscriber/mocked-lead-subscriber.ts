import { Service } from 'typedi';
import { LeadSubscriberOptions, LeadSubscriberInterface } from './interfaces';

@Service()
export default class MockedLeadSubscriber implements LeadSubscriberInterface {
  public async subscribe(email: string, options: LeadSubscriberOptions): Promise<any> {
  }

  public async sync(): Promise<any> {
  }
}
