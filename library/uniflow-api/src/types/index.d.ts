import { UserEntity } from '../entity';

declare global {
  namespace Express {
    export interface Request {
      user: UserEntity
    }
  }
}

export { ExceptionInterface } from '../exception/interfaces'
export { FixtureInterface } from '../fixture/interfaces'
export { LoaderInterface } from '../loader/interfaces'
export { RequestInterface, RequestConfig, ResponseInterface } from '../service/request/interfaces'
export { MailerInterface, MailerOptions } from '../service/mailer/interfaces'
