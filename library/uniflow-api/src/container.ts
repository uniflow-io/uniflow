import { Container as DIContainer, ObjectType, Token } from "typedi"
import { IocContainer } from "@tsoa/runtime";
import { MailchimpLeadSubscriber, MockedLeadSubscriber } from "./service/lead-subscriber"
import { NodeMailer, MockedMailer } from "./service/mailer"
import { AxiosRequest, MockedRequest } from "./service/request"
import { ConnectionManager } from 'typeorm';

export default class Container implements IocContainer {
    constructor(protected init: boolean = false) {}
    
    get<T>(type: ObjectType<T>): T;
    get<T>(id: string): T;
    get<T>(id: Token<T>): T;
    get<T>(service: {
        service: T;
    }): T;
    get<T>(type: ObjectType<T>): T;
    get<T>(controller: { prototype: T; }): T;
    get<T>(id: any): T {
        if(!this.init) {
            const env = process.env.NODE_ENV || 'development'
            DIContainer.set('env', env)

            // typedi + typeorm
            DIContainer.set({ id: ConnectionManager, type: ConnectionManager });
          
            if(env === 'test') {
                DIContainer.set('RequestInterface', DIContainer.get(MockedRequest))
                DIContainer.set('MailerInterface', DIContainer.get(MockedMailer))
                DIContainer.set('LeadSubscriberInterface', DIContainer.get(MockedLeadSubscriber))
            } else {
                DIContainer.set('RequestInterface', DIContainer.get(AxiosRequest))
                DIContainer.set('MailerInterface', DIContainer.get(NodeMailer))
                DIContainer.set('LeadSubscriberInterface', DIContainer.get(MailchimpLeadSubscriber))
            }
            
            this.init = true
        }

        return DIContainer.get(id)
    }
}

const iocContainer = new Container()

export { iocContainer }
