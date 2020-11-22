import { UserEntity } from '../entity';

declare global {
  namespace Express {
    export interface Request {
      token?: { id: string }
      user: UserEntity
    }
  }
}

export { ControllerInterface } from '../controller/interfaces'
export { ExceptionInterface } from '../exception/interfaces'
export { FixtureInterface } from '../fixture/interfaces'
export { LoaderInterface } from '../loader/interfaces'
export { MiddlewareInterface } from '../middleware/interfaces'
export { RequestInterface, RequestConfig, ResponseInterface } from '../service/request/interfaces'
export { MailerInterface, MailerOptions } from '../service/mailer/interfaces'
