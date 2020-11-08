import * as mailchimp from '@mailchimp/mailchimp_marketing'
import * as md5 from 'md5'
import { Service } from 'typedi';
import { ParamsConfig } from '../../config';
import { LeadSubscriberOptions, LeadSubscriberInterface } from './interfaces';

@Service()
export default class MailchimpLeadSubscriber implements LeadSubscriberInterface {
  private mailchimp

  constructor(
    private paramsConfig: ParamsConfig,
  ) {
    mailchimp.setConfig({
      apiKey: paramsConfig.getConfig().get('mailchimp.apiKey'),
      server: paramsConfig.getConfig().get('mailchimp.serverPrefix'),
    });
    this.mailchimp = mailchimp
  }

  public async subscribe(email: string, options: LeadSubscriberOptions): Promise<any> {
    const subscriberHash = md5(email.toLowerCase());

    await this.mailchimp.lists.setListMember(
      this.paramsConfig.getConfig().get('mailchimp.listId'),
      subscriberHash, {
        status_if_new: "subscribed",
      }
    );

    const body: any = { tags: [] };

    if (options.type === 'newsletter') {
      body.tags.push({
        name: "uniflow-newsletter",
        status: "active",
      });
    }

    await this.mailchimp.lists.updateListMemberTags(
      this.paramsConfig.getConfig().get('mailchimp.listId'),
      subscriberHash, {
        body,
      }
    );
  }
}
