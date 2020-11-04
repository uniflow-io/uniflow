import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { UserEntity } from '../../entities';
import { AuthService } from '../../services';
import { WithTokenMiddleware, WithUserMiddleware } from "../middlewares";
import { ControllerInterface } from '../../types';

@Service()
export default class AuthController implements ControllerInterface {
  constructor(
    private authService: AuthService,
    private withToken: WithTokenMiddleware,
    private withUser: WithUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

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
          const { token, user } = await this.authService.register(req.body as UserEntity);
          return res.json({ token, uid: user.uid }).status(201);
        } catch (e) {
          //console.log(' error ', e);
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
          const { token, user } = await this.authService.login(username, password);
          return res.json({ token, uid: user.uid }).status(201);
        } catch (e) {
          //console.log(' error ', e);
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
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { access_token } = req.body;
          const { token, user } = await this.authService.facebookLogin(access_token, req.user);
          return res.json({ token, uid: user.uid }).status(201);
        } catch (e) {
          //console.log(' error ', e);
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
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { code } = req.body;
          const { token, user } = await this.authService.githubLogin(code, req.user);
          return res.json({ token, uid: user.uid }).status(201);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}