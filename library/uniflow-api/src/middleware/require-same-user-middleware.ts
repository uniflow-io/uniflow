import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { ApiException } from "../exception";
import { MiddlewareInterface } from './interfaces';

@Service()
export default class RequireSameUserMiddleware implements MiddlewareInterface {
  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user || req.params.uid !== req.user.uid) {
          throw new ApiException('Not authorized', 401);
        }
        
        return next();
      } catch (e) {
        //console.log(e);
        return next(e);
      }
    }
  }
}