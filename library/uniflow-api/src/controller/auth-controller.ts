import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { AuthService } from '../service';
import { WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { ControllerInterface } from './interfaces';
import { TypeModel } from '../model';

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
      '/login',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          username: Joi.string().required().custom(TypeModel.joiEmailOrUsername),
          password: Joi.string().required(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { username, password } = req.body;
          const { token, user } = await this.authService.login(username, password);
          return res.status(201).json({ token, uid: user.uid });
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
          const { token, user } = await this.authService.facebookLogin(access_token, req.appUser);
          return res.status(201).json({ token, uid: user.uid });
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
          const { token, user } = await this.authService.githubLogin(code, req.appUser);
          return res.status(201).json({ token, uid: user.uid });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}
