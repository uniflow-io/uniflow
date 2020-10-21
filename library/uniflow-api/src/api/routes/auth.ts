import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { User } from '../../models';
import { AuthService } from '../../services';
import { withToken, withUser } from "../middlewares";
const route = Router();

export default (app: Router) => {
  app.use('/', route);

  route.post(
    '/register',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authService = Container.get(AuthService);
        const { token } = await authService.register(req.body as User);
        return res.json({ token }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/login',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, password } = req.body;
        const authService = Container.get(AuthService);
        const { token } = await authService.login(username, password);
        return res.json({ token }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/login-facebook',
    celebrate({
      body: Joi.object({
        access_token: Joi.string().required(),
      }),
    }),
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { access_token } = req.body;
        const authService = Container.get(AuthService);
        const { token } = await authService.facebookLogin(access_token, req.user);
        return res.json({ token }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/login-github',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
      }),
    }),
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { code } = req.body;
        const authService = Container.get(AuthService);
        const { token } = await authService.githubLogin(code, req.user);
        return res.json({ token }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
