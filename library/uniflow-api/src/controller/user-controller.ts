import { Service} from "typedi";
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router} from 'express';
import { RequireSameUserMiddleware, RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { UserService, ConfigService } from "../service";
import { ConfigEntity, UserEntity } from "../entity";
import { ControllerInterface } from './interfaces';

@Service()
export default class UserController implements ControllerInterface {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private withToken: WithTokenMiddleware,
    private withUser: WithUserMiddleware,
    private requireRoleUser: RequireRoleUserMiddleware,
    private requireSameUser: RequireSameUserMiddleware,
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/users', route);

    route.post(
      '/',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
          password: Joi.string().required(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const user = await this.userService.create(req.body as UserEntity);
          return res.status(201).json({ uid: user.uid });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.get(
      '/:uid/settings',
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          return res.status(200).json(await this.userService.getJson(req.user));
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );
  
    route.put(
      '/:uid/settings',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          firstname: Joi.string().allow(null, ''),
          lastname: Joi.string().allow(null, ''),
          username: Joi.string().allow(null, ''),
          apiKey: Joi.string().allow(null, ''),
          facebookId: Joi.string().allow(null, ''),
          githubId: Joi.string().allow(null, ''),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          if(req.body.username && req.body.username !== req.user.username) {
            req.body.username = await this.userService.generateUniqueUsername(req.body.username)
          }
          
          let user = Object.assign(req.user, req.body);
    
          if(await this.userService.isValid(user)) {
            await this.userService.save(user)
    
            return res.status(200).json(await this.userService.getJson(user));
          }
    
          return res.status(400).json({
            'messages': ['User not valid'],
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );
  
    route.get(
      '/:uid/admin-config',
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware('ROLE_SUPER_ADMIN'),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let config = await this.configService.findOne();
          if(!config) {
            config = new ConfigEntity()
          }
          
          return res.status(200).json(await this.configService.getJson(config));
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );
  
    route.put(
      '/:uid/admin-config',
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware('ROLE_SUPER_ADMIN'),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let config = await this.configService.findOne();
          if(!config) {
            config = new ConfigEntity()
          }
    
          if(await this.configService.isValid(config)) {
            await this.configService.save(config)
    
            return res.status(200).json(await this.configService.getJson(config));
          }
    
          return res.status(400).json({
            'messages': ['Config not valid'],
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}
