import { User } from '@uniflow-io/uniflow-api/src/models';

declare global {
  namespace Express {
    export interface Request {
      user: User
      token: any
    }
  }
}
