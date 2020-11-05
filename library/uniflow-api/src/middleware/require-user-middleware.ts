import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service';
import { Exception } from "../exception";
import { MiddlewareInterface } from './interfaces';
import { UserEntity } from '../entity';

@Service()
export default class RequireUserMiddleware implements MiddlewareInterface {
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

  middleware(role: string = 'ROLE_USER', isSameUser: boolean = false): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.token) {
          throw new Exception('Not authorized', 401);
        }
        
        const userRecord = await this.userService.findOne(req.token.id);
        if (!userRecord) {
          throw new Exception('Not authorized', 401);
        }

        if(!this.isGranted(userRecord, [role])) {
          throw new Exception('Not authorized', 401);
        }

        if(isSameUser) {
          if(req.params.uid !== userRecord.uid) {
            throw new Exception('Not authorized', 401);
          }
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