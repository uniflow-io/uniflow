import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service';
import { Exception } from "../exception";
import { MiddlewareInterface } from '../type';

@Service()
export default class RequireUserMiddleware implements MiddlewareInterface {
  constructor(
    private userService: UserService
  ) {}

  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.token) {
          throw new Exception('Not authorized', 401);
        }
        
        const userRecord = await this.userService.findOne(req.token.id);
        if (!userRecord) {
          throw new Exception('Not authorized', 401);
        }
        
        const user = userRecord;
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        req.user = user;
        return next();
      } catch (e) {
        console.log(' Error attaching user to req');
        console.log(e);
        return next(e);
      }
    }
  }
}