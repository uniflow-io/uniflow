export interface LeadSubscriberOptions {
  type: 'newsletter'
}

export interface LeadSubscriberInterface {
  subscribe(email: string, options: LeadSubscriberOptions): Promise<any>;
  sync(): Promise<any>;
}