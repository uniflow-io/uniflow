import * as nodeMailerer from 'nodemailer'
import { Service } from 'typedi';
import { MailerOptions, MailerInterface } from './interfaces';
import { ParamsConfig } from '../../config'

@Service()
export default class Mailer implements MailerInterface {
  constructor(
    private paramsConfig: ParamsConfig
  ) {}

  send(options: MailerOptions): Promise<any> {
    return nodeMailerer
      .createTransport(this.paramsConfig.getConfig().get('mailerUrl'))
      .sendMail(options);
  }
}
