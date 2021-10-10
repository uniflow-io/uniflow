import * as nodemailer from 'nodemailer'
import { Service } from 'typedi';
import { MailerOptions, MailerInterface } from './interfaces';
import { AppConfig } from '../../config'

@Service()
export default class NodeMailer implements MailerInterface {
  constructor(
    private appConfig: AppConfig
  ) {}

  send(options: MailerOptions): Promise<any> {
    return nodemailer
      .createTransport(this.appConfig.getConfig().get('mailerUrl'))
      .sendMail(options);
  }
}
