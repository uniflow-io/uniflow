import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router} from 'express';
import { Service} from "typedi";
import { ProgramService, ProgramClientService, ProgramTagService, FolderService } from "../service";
import { RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { ApiException } from "../exception";
import { ControllerInterface } from './interfaces';
import { ProgramRepository, TagRepository } from '../repository';
import { TypeModel } from '../model';

@Service()
export default class ProgramController implements ControllerInterface {
  constructor(
    private tagRepository: TagRepository,
    private programRepository: ProgramRepository,
    private folderService: FolderService,
    private programService: ProgramService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
    private withToken: WithTokenMiddleware,
    private requireRoleUser: RequireRoleUserMiddleware,
    private withUser: WithUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/programs', route);

    route.get(
      '/',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = []
          const programs = await this.programRepository.find({
            where: { public: true },
            relations: ['folder', 'user'],
            order: { updated: "DESC" }
          })
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

    route.put(
      '/:uid',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeModel.joiUuid)
        }),
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
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
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const program = await this.programRepository.findOne({
            where: {user: req.user, uid: req.params.uid},
            relations: ['user', 'folder'],
          })
          if (!program) {
            throw new ApiException('Program not found', 404);
          }
          
          if(req.body.name) {
            program.name = req.body.name
          }
          program.user = req.user
          if(req.body.path) {
            program.folder = await this.folderService.fromPath(req.user, req.body.path) || null
            await this.folderService.setSlug(program, program.slug) // in case of slug conflict when moving program
          }
          if (req.body.slug && program.slug !== req.body.slug) {
            await this.folderService.setSlug(program, req.body.slug)
          }
          if(req.body.clients) {
            program.clients = await this.programClientService.manageByProgramAndClientNames(program, req.body.clients)
          }
          if(req.body.tags) {
            program.tags = await this.programTagService.manageByProgramAndTagNames(program, req.body.tags)
          }
          if(req.body.description) {
            program.description = req.body.description
          }
          if(req.body.public || req.body.public === false) {
            program.public = req.body.public
          }

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

    route.delete(
      '/:uid',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeModel.joiUuid)
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const program = await this.programRepository.findOne({user: req.user, uid: req.params.uid})
          if (!program) {
            throw new ApiException('Program not found', 404);
          }

          await this.programRepository.safeRemove(program)

          return res.status(200).json(true);
        } catch (e) {
          console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.get(
      '/:uid/flows',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeModel.joiUuid)
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const program = await this.programRepository.findOne({
            where: {uid: req.params.uid},
            relations: ['user']
          })
          if (!program) {
            throw new ApiException('Program not found', 404);
          }
          
          if(!program.public) {
            if(!req.user || program.user.id !== req.user.id) {
              throw new ApiException('Not authorized', 401);
            }
          }

          return res.status(200).json({'data': program.data});
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.put(
      '/:uid/flows',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeModel.joiUuid)
        }),
        [Segments.BODY]: Joi.object().keys({
          data: Joi.string(),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const program = await this.programRepository.findOne({user: req.user, uid: req.params.uid})
          if (!program) {
            throw new ApiException('Program not found', 404);
          }

          program.data = req.body.data

          if(await this.programService.isValid(program)) {
            await this.programRepository.save(program)

            return res.status(200).json(true);
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

    return app;
  }
};
