import { Container as DIContainer, ServiceIdentifier, Constructable } from "typedi"
import { ContainedType, ContainerInterface, useContainer } from 'typeorm';
import { MailchimpLeadSubscriber, MockedLeadSubscriber } from "./service/lead-subscriber"
import { NodeMailer, MockedMailer } from "./service/mailer"
import { AxiosRequest, MockedRequest } from "./service/request"
import { ConnectionManager } from 'typeorm';

export default class Container implements ContainerInterface {
    static init: boolean = false

    get<T>(someClass: ContainedType<T>): T {
        return Container.get(someClass);
    }

    static get<T>(someClass: ContainedType<T>): T;
    static get<T>(id: ServiceIdentifier<T>): T;
    static get<T>(service: {
        service: T;
    }): T;
    static get<T>(id: any): T {
        if(!this.init) {
            const env = process.env.NODE_ENV || 'development'
            DIContainer.set('env', env)

            // typedi + typeorm
            useContainer(Container);
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

        /**
         * https://github.com/typeorm/typeorm-typedi-extensions/blob/master/src/container-provider.class.ts
         * 
         * TypeDI only resolves values for registered types, so we need to register
         * them before to requesting them from the default container.
         */
        if (!DIContainer.has(id as Constructable<T>)) {
            DIContainer.set({ id: id, type: id as Constructable<T> });
        }

        return DIContainer.get(id)
    }
}
