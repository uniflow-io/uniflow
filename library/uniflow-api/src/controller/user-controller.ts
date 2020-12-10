import { Service} from "typedi";
import { celebrate, Joi, Segments } from 'celebrate';
import { Operation } from "express-openapi";
import { NextFunction, Request, Response, Router} from 'express';
import { RequireSameUserMiddleware, RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { UserService, ConfigService, FolderService, ProgramService, ProgramClientService, ProgramTagService } from "../service";
import { ControllerInterface, ControllerOperations } from './interfaces';
import { ConfigRepository, FolderRepository, ProgramRepository, TagRepository, UserRepository } from "../repository";
import { ApiException } from "../exception";
import { TypeModel } from "../model";
import { IsNull } from "typeorm";
import { ConfigFactory, ProgramFactory, FolderFactory } from "../factory";

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
    private configFactory: ConfigFactory,
    private folderFactory: FolderFactory,
    private programFactory: ProgramFactory,
  ) {}

  basePath(): string {
    return '/users'
  }

  operations(): ControllerOperations {
    return {
      '/': {
        post: (() => {
          const operation: Operation = async (req: Request, res: Response, next: NextFunction) => {
            try {
              const user = await this.userService.create({
                email: req.body.email,
                plainPassword: req.body.password,
              });
              return res.status(201).json({ uid: user.uid });
            } catch (e) {
              return next(e);
            }
          }
      
          operation.apiDoc = {
            description: 'Create User.',
            operationId: 'createUser',
            responses: {
              201: {
                description: 'User Created.',
              },
            },
          }
          return operation
        })()
      }
    }
    /*
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
          const user = await this.userService.create({
            email: req.body.email,
            plainPassword: req.body.password,
          });
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
        }),
        [Segments.BODY]: Joi.object().keys({
          firstname: Joi.string().allow(null, ''),
          lastname: Joi.string().allow(null, ''),
          username: Joi.string().allow(null, '').custom(TypeModel.joiUsername),
          apiKey: Joi.string().allow(null, '').custom(TypeModel.joiApiKey),
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
          const user = await this.userRepository.findOne(req.token?.id);
          if (!user) {
            throw new ApiException('User not found', 404);
          }

          user.firstname = req.body.firstname ? req.body.firstname : null
          user.lastname = req.body.lastname ? req.body.lastname : null
          user.username = req.body.username ? user.username : null
          user.apiKey = req.body.apiKey ? req.body.apiKey : null
          user.facebookId = req.body.facebookId ? req.body.facebookId : null
          user.githubId = req.body.githubId ? req.body.githubId : null
          
          if(req.body.username && req.body.username !== req.user.username) {
            await this.userService.setUsername(user, req.body.username)
          }
    
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware('ROLE_SUPER_ADMIN'),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const config = await this.configFactory.create(await this.configRepository.findOne());
          
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware('ROLE_SUPER_ADMIN'),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const config = await this.configFactory.create(await this.configRepository.findOne());
    
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
        }),
        [Segments.QUERY]: Joi.object().keys({
          path: Joi.string().custom(TypeModel.joiPath),
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

          let where: any = {user}
          if(req.query.path) {
            const parent = await this.folderService.fromPath(user, req.query.path as string)
            where = {...where, parent: parent ? parent : IsNull()}
          }
          const folders = await this.folderRepository.find({
            where,
            relations: ['parent', 'user'],
          })
          
          const data = []
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
        }),
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string().required(),
          slug: Joi.string(),
          path: Joi.string().custom(TypeModel.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      this.requireSameUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderFactory.create({
            name: req.body.name,
            parent: await this.folderService.fromPath(req.user, req.body.path || '/') || null,
            user: req.user,
          })
          await this.folderService.setSlug(folder, req.body.slug || req.body.name)
    
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
          uid: Joi.string().custom(TypeModel.joiUuidOrUsername)
        }),
        [Segments.QUERY]: Joi.object().keys({
          path: Joi.string().custom(TypeModel.joiPath),
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

          let where: any = {user}
          const isPublicOnly = !req.user || !TypeModel.isSameUser(req.params.uid, req.user)
          if(isPublicOnly) {
            where = {...where, public: true}
          }
          if(req.query.path) {
            const folder = await this.folderService.fromPath(user, req.query.path as string)
            where = {...where, folder: folder ? folder : IsNull()}
          }
          const programs = await this.programRepository.find({
            where,
            relations: ['folder', 'user'],
          })
          
          const data = []
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
          name: Joi.string().required(),
          slug: Joi.string(),
          path: Joi.string().custom(TypeModel.joiPath),
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
          const program = await this.programFactory.create({
            name: req.body.name,
            user: req.user,
            folder: await this.folderService.fromPath(req.user, req.body.path || '/') || null,
            description: req.body.description ? req.body.description : null,
            public: req.body.public || false,
          })
          await this.folderService.setSlug(program, req.body.slug || req.body.name)
          program.clients = await this.programClientService.manageByProgramAndClientNames(program, req.body.clients || [])
          program.tags = await this.programTagService.manageByProgramAndTagNames(program, req.body.tags || [])

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

    return app*/
  }
}
