import * as nodemailer from 'nodemailer'
import { Service } from 'typedi';
import { MailerOptions, MailerInterface } from './interfaces';
import appConfig from '../../config/app-config'

@Service()
export default class NodeMailer implements MailerInterface {
  send(options: MailerOptions): Promise<any> {
    return nodemailer
      .createTransport(appConfig.get('mailerUrl'))
      .sendMail(options);
  }
}
