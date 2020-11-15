import { Service} from "typedi";
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router} from 'express';
import { RequireSameUserMiddleware, RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { UserService, ConfigService, FolderService, ProgramService, ProgramClientService, ProgramTagService } from "../service";
import { ConfigEntity, FolderEntity, ProgramEntity, UserEntity } from "../entity";
import { ControllerInterface } from './interfaces';
import { ConfigRepository, FolderRepository, ProgramRepository, TagRepository, UserRepository } from "../repository";
import { ApiException } from "../exception";
import { TypeChecker } from "../model";

@Service()
export default class UserController implements ControllerInterface {
  constructor(
    private tagRepository: TagRepository,
    private programRepository: ProgramRepository,
    private userRepository: UserRepository,
    private configRepository: ConfigRepository,
    private folderRepository: FolderRepository,
    private userService: UserService,
    private configService: ConfigService,
    private folderService: FolderService,
    private programService: ProgramService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
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
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
      }),
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
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
        [Segments.BODY]: Joi.object().keys({
          firstname: Joi.string().allow(null, ''),
          lastname: Joi.string().allow(null, ''),
          username: Joi.string().allow(null).custom(TypeChecker.joiUsername),
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
          
          const user = Object.assign(req.user, req.body);
    
          if(await this.userService.isValid(user)) {
            await this.userRepository.save(user)
    
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
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware('ROLE_SUPER_ADMIN'),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let config = await this.configRepository.findOne();
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
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware('ROLE_SUPER_ADMIN'),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let config = await this.configRepository.findOne();
          if(!config) {
            config = new ConfigEntity()
          }
    
          if(await this.configService.isValid(config)) {
            await this.configRepository.save(config)
    
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

    route.get(
      '/:uid/folders',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
        [Segments.QUERY]: Joi.object().keys({
          path: Joi.string().custom(TypeChecker.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const user = await this.userRepository.findOneByUidOrUsername(req.params.uid)
          if (!user) {
            throw new ApiException('User not found', 404);
          }

          const data = []
          const parent = req.query.path ? this.folderService.fromPath(user, req.query.path as string) : undefined
          const folders = await this.folderRepository.find({user})
          for (const folder of folders) {
            data.push(await this.folderService.getJson(folder))
          }

          return res.status(200).json(data);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.post(
      '/:uid/folders',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string().required(),
          slug: Joi.string().custom(TypeChecker.joiSlug),
          path: Joi.string().custom(TypeChecker.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = new FolderEntity();
          folder.name = req.body.name
          folder.parent = await this.folderService.fromPath(req.user, req.body.path)
          folder.slug = await this.folderService.generateUniqueSlug(req.body.slug || req.body.name, req.user, folder.parent)
          folder.user = req.user
    
          if(await this.folderService.isValid(folder)) {
            await this.folderRepository.save(folder)
    
            return res.status(200).json(await this.folderService.getJson(folder));
          }
    
          return res.status(400).json({
            'messages': ['Folder not valid'],
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.get(
      '/:uid/programs',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuidOrUsername)
        }),
        [Segments.QUERY]: Joi.object().keys({
          path: Joi.string().custom(TypeChecker.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const user = await this.userRepository.findOneByUidOrUsername(req.params.uid)
          if (!user) {
            throw new ApiException('User not found', 404);
          }

          const data = []
          const folder = req.query.path ? await this.folderService.fromPath(user, req.query.path as string) : undefined
          const isPublic = req.user && TypeChecker.isSameUser(req.params.uid, req.user) ? undefined : true
          const programs = await this.programRepository.find({user, folder, public: isPublic})
          for (const program of programs) {
            data.push(await this.programService.getJson(program))
          }

          return res.status(200).json(data);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.post(
      '/:uid/programs',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string().custom(TypeChecker.joiSlug),
          path: Joi.string().custom(TypeChecker.joiPath),
          clients: Joi.array(),
          tags: Joi.array(),
          description: Joi.string().allow(null, ''),
          public: Joi.boolean(),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const program = new ProgramEntity();
          program.name = req.body.name
          program.user = req.user
          program.folder = await this.folderService.fromPath(req.user, req.body.path)
          program.slug = await this.programService.generateUniqueSlug(req.user, req.body.slug, program.folder)
          program.clients = await this.programClientService.manageByProgramAndClientNames(program, req.body.clients)
          program.tags = await this.programTagService.manageByProgramAndTagNames(program, req.body.tags)
          program.description = req.body.description
          program.public = req.body.public

          if(await this.programService.isValid(program)) {
            await this.programRepository.save(program)
            await this.tagRepository.clear()

            return res.status(200).json(await this.programService.getJson(program));
          }

          return res.status(400).json({
            'messages': ['Program not valid'],
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
