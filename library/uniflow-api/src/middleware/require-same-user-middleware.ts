import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { ApiException } from "../exception";
import { MiddlewareInterface } from './interfaces';
import { TypeCheckerModel } from '../model';

@Service()
export default class RequireSameUserMiddleware implements MiddlewareInterface {
  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user || !req.params.uid) {
          throw new ApiException('Not authorized', 401);
        }

        if(TypeCheckerModel.isSameUser(req.params.uid, req.user)) {
          return next();
        }
        
        throw new ApiException('Not authorized', 401);
      } catch (e) {
        //console.log(e);
        return next(e);
      }
    }
  }
}