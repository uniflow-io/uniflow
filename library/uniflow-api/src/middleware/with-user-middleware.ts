import { Service } from 'typedi';
import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from './interfaces';
import { UserRepository } from '../repository';

@Service()
export default class WithUserMiddleware implements MiddlewareInterface {
  constructor(
    private userRepository: UserRepository
  ) {}

  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.token) {
          return next();
        }
        
        const user = await this.userRepository.findOne(req.token.id);
        if (!user) {
          return next();
        }
        
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