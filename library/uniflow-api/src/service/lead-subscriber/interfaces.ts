import { LeadEntity } from "../../entity";

export interface LeadSubscriberOptions {
  types: Array<'newsletter'|'blog'>
}

export interface LeadSubscriberInterface {
  subscribe(lead: LeadEntity): Promise<any>;
  sync(): Promise<any>;
}