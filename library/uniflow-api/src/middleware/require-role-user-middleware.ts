import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service';
import { ApiException } from "../exception";
import { MiddlewareInterface } from './interfaces';

@Service()
export default class RequireRoleUserMiddleware implements MiddlewareInterface {
  constructor(
    private userService: UserService
  ) {}

  middleware(role: string = 'ROLE_USER'): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if(!req.appUser || !this.userService.isGranted(req.appUser, role)) {
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
