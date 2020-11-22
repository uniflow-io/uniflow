import * as nodemailer from 'nodemailer'
import { Service } from 'typedi';
import { MailerOptions, MailerInterface } from './interfaces';
import { ParamsConfig } from '../../config'

@Service()
export default class NodeMailer implements MailerInterface {
  constructor(
    private paramsConfig: ParamsConfig
  ) {}

  send(options: MailerOptions): Promise<any> {
    return nodemailer
      .createTransport(this.paramsConfig.getConfig().get('mailerUrl'))
      .sendMail(options);
  }
}
