import {NextFunction, Request, Response, Router} from 'express';
import {requireUser, withToken} from "../middlewares";
import {Container} from "typedi";
import { UserService } from "../../services";
import {celebrate, Joi} from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get(
    '/get-settings',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = Container.get(UserService);
        
        return res.json(await userService.getJson(req.user)).status(200);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.put(
    '/set-settings',
    celebrate({
      body: Joi.object({
        firstname: Joi.string().allow(null, ''),
        lastname: Joi.string().allow(null, ''),
        username: Joi.string().allow(null, ''),
        apiKey: Joi.string().allow(null, ''),
        facebookId: Joi.string().allow(null, ''),
        githubId: Joi.string().allow(null, ''),
      }),
    }),
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = Container.get(UserService);
  
        if(req.body.username && req.body.username !== req.user.username) {
          req.body.username = await userService.generateUniqueUsername(req.body.username)
        }
        
        let user = Object.assign(req.user, req.body);
  
        if(await userService.isValid(user)) {
          await userService.save(user)
  
          return res.json(await userService.getJson(user)).status(200);
        }
  
        return res.json({
          'message': 'User not valid',
        }).status(400);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
