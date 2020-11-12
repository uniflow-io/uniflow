import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service';
import { ApiException } from "../exception";
import { MiddlewareInterface } from './interfaces';
import { UserEntity } from '../entity';

@Service()
export default class RequireRoleUserMiddleware implements MiddlewareInterface {
  constructor(
    private userService: UserService
  ) {}

  private isGranted(user: UserEntity, attributes: Array<string>): boolean {
    if (!Array.isArray(attributes)) {
      attributes = [attributes]
    }
  
    let roles = []
    if (user.role === 'ROLE_SUPER_ADMIN') {
      roles.push('ROLE_USER')
      roles.push('ROLE_SUPER_ADMIN')
    } else {
      roles.push(user.role)
    }
  
    for (let i = 0; i < attributes.length; i++) {
      let attribute = attributes[i]
      for (let j = 0; j < roles.length; j++) {
        let role = roles[j]
  
        if (attribute === role) {
          return true
        }
      }
    }

    return false
  }

  middleware(role: string = 'ROLE_USER'): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if(!req.user || !this.isGranted(req.user, [role])) {
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