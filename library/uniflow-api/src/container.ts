import { Container as DIContainer, ObjectType } from "typedi"
import { Mailer, MailerMocked } from "./service/mailer"
import { Request, RequestMocked } from "./service/request"

export default class Container {
    static init: boolean = false
    static get<T>(type: ObjectType<T>): T {
        if(!this.init) {
            const env = process.env.NODE_ENV || 'development'
            DIContainer.set('env', env)
    
            if(env === 'test') {
                DIContainer.set('RequestInterface', DIContainer.get(RequestMocked))
                DIContainer.set('MailerInterface', DIContainer.get(MailerMocked))
            } else {
                DIContainer.set('RequestInterface', DIContainer.get(Request))
                DIContainer.set('MailerInterface', DIContainer.get(Mailer))
            }
            
            this.init = true
        }

        return DIContainer.get(type)
    }
}