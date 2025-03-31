export interface MailerOptions {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
}

export interface MailerInterface {
  send(options: MailerOptions): Promise<any>;
}