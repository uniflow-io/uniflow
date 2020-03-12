import { User } from '@uniflow-io/uniflow-api/dist/models';

declare global {
  namespace Express {
    export interface Request {
      user: User
      token: any
    }
  }
}
