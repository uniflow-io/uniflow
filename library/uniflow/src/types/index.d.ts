import { UserEntity } from '@uniflow-io/uniflow-api/entity';

declare global {
  namespace Express {
    export interface Request {
      user?: UserEntity
    }
  }
}

export { ExceptionInterface } from '@uniflow-io/uniflow-api/exception/interfaces'
export { FixtureInterface } from '@uniflow-io/uniflow-api/fixture/interfaces'
export { LoaderInterface } from '@uniflow-io/uniflow-api/loader/interfaces'
export { RequestInterface, RequestConfig, ResponseInterface } from '@uniflow-io/uniflow-api/service/request/interfaces'
export { MailerInterface, MailerOptions } from '@uniflow-io/uniflow-api/service/mailer/interfaces'
