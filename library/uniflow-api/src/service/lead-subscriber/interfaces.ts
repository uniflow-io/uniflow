import { LeadEntity } from "../../entity";

export interface LeadSubscriberInterface {
  update(lead: LeadEntity): Promise<any>;
  sync(): Promise<any>;
}