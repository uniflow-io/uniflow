import { Container } from 'typedi';
import {NextFunction, Request, Response} from "express";
import UserService from '../../services/user';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const withUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.token) {
      return next();
    }
    
    const userServiceInstance = Container.get(UserService);
    const userRecord = await userServiceInstance.findOne(req.token.id);
    if (!userRecord) {
      return next();
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
};

export default withUser;
