import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { ApiException } from "../exception";
import { MiddlewareInterface } from './interfaces';

const checkUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Service()
export default class RequireSameUserMiddleware implements MiddlewareInterface {
  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new ApiException('Not authorized', 401);
        }

        if(checkUUID.test(req.params.uid) && req.params.uid === req.user.uid) {
          return next();
        } else if (req.user.username && req.params.uid === req.user.username) {
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