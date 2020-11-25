export interface LeadSubscriberOptions {
  types: Array<'newsletter'|'blog'>
}

export interface LeadSubscriberInterface {
  subscribe(email: string, options: LeadSubscriberOptions): Promise<any>;
  sync(): Promise<any>;
}