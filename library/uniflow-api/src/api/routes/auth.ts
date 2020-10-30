import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { User } from '../../entities';
import { AuthService } from '../../services';
import { withToken, withUser } from "../middlewares";
const route = Router();

export default (app: Router) => {
  app.use('/', route);

  route.post(
    '/register',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authService = Container.get(AuthService);
        const { token, user } = await authService.register(req.body as User);
        return res.json({ token, uid: user.uid }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/login',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, password } = req.body;
        const authService = Container.get(AuthService);
        const { token, user } = await authService.login(username, password);
        return res.json({ token, uid: user.uid }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/login-facebook',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        access_token: Joi.string().required(),
      }),
    }),
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { access_token } = req.body;
        const authService = Container.get(AuthService);
        const { token, user } = await authService.facebookLogin(access_token, req.user);
        return res.json({ token, uid: user.uid }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/login-github',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        code: Joi.string().required(),
      }),
    }),
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { code } = req.body;
        const authService = Container.get(AuthService);
        const { token, user } = await authService.githubLogin(code, req.user);
        return res.json({ token, uid: user.uid }).status(201);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
