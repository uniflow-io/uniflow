import { Service } from 'typedi';
import { NextFunction, Request, Response } from "express";
import { UserService } from '../service';
import { MiddlewareInterface } from './interfaces';

@Service()
export default class WithUserMiddleware implements MiddlewareInterface {
  constructor(
    private userService: UserService
  ) {}

  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.token) {
          return next();
        }
        
        const userRecord = await this.userService.findOne(req.token.id);
        if (!userRecord) {
          return next();
        }
        
        const user = userRecord;
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        req.user = user;
        return next();
      } catch (e) {
        //console.log(e);
        return next(e);
      }
    }
  }
}