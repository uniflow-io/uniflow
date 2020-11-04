import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router} from 'express';
import { Service} from "typedi";
import { ProgramService, ProgramClientService, ProgramTagService, FolderService, TagService } from "../../services";
import { ProgramEntity } from "../../entities";
import { RequireUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middlewares";
import { Exception } from "../../exception";
import { ControllerInterface } from '../../types';

@Service()
export default class ProgramController implements ControllerInterface {
  constructor(
    private folderService: FolderService,
    private programService: ProgramService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
    private tagService: TagService,
    private withToken: WithTokenMiddleware,
    private requireUser: RequireUserMiddleware,
    private withUser: WithUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/programs', route);

    route.get(
      '/last-public',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let programItems = []
          const programs = await this.programService.findLastPublic(15)
          for(const program of programs) {
            programItems.push({
              'name': program.name,
              'slug': program.slug,
              'path': await this.folderService.toPath(program.folder),
              'description': program.description,
              'username': program.user.username,
            })
          }

          return res.json({
            'programs': programItems
          }).status(200);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      }
    );
    
    route.post(
      '/create',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string(),
          path: Joi.array(),
          clients: Joi.array(),
          tags: Joi.array(),
          description: Joi.string().allow(null, ''),
          public: Joi.boolean(),
        }),
      }),
      this.withToken.middleware(),
      this.requireUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = new ProgramEntity();
          program.name = req.body.name
          program.slug = await this.programService.generateUniqueSlug(req.user, req.body.slug)
          program.user = req.user
          program.folder = await this.folderService.findOneByUserAndPath(req.user, req.body.path)
          program.clients = await this.programClientService.manageByProgramAndClientNames(program, req.body.clients)
          program.tags = await this.programTagService.manageByProgramAndTagNames(program, req.body.tags)
          program.description = req.body.description
          program.public = req.body.public

          if(await this.programService.isValid(program)) {
            await this.programService.save(program)
            await this.tagService.clear()

            return res.json(await this.programService.getJson(program)).status(200);
          }

          return res.json({
            'message': 'Program not valid',
          }).status(400);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.put(
      '/:uid/update',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string(),
          path: Joi.array(),
          clients: Joi.array(),
          tags: Joi.array(),
          description: Joi.string().allow(null, ''),
          public: Joi.boolean(),
        }),
      }),
      this.withToken.middleware(),
      this.requireUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programService.findOneByUser(req.user, req.params.id)
          if (!program) {
            throw new Exception('Program not found', 404);
          }
          
          program.name = req.body.name
          if (req.body.slug && program.slug !== req.body.slug) {
            program.slug = await this.programService.generateUniqueSlug(req.user, req.body.slug)
          }
          program.user = req.user
          program.folder = await this.folderService.findOneByUserAndPath(req.user, req.body.path)
          program.clients = await this.programClientService.manageByProgramAndClientNames(program, req.body.clients)
          program.tags = await this.programTagService.manageByProgramAndTagNames(program, req.body.tags)
          program.description = req.body.description
          program.public = req.body.public

          if(await this.programService.isValid(program)) {
            await this.programService.save(program)
            await this.tagService.clear()

            return res.json(await this.programService.getJson(program)).status(200);
          }

          return res.json({
            'message': 'Program not valid',
          }).status(400);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.get(
      '/:uid/data',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programService.findOne(req.params.id)
          if (!program) {
            throw new Exception('Program not found', 404);
          }
          
          if(!program.public) {
            if(!req.user || program.user.id != req.user.id) {
              throw new Exception('Not authorized', 401);
            }
          }

          return res.json({'data': program.data}).status(200);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.put(
      '/:uid/data',
      this.withToken.middleware(),
      this.requireUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programService.findOneByUser(req.user, req.params.id)
          if (!program) {
            throw new Exception('Program not found', 404);
          }

          program.data = req.body.data

          if(await this.programService.isValid(program)) {
            await this.programService.save(program)

            return res.json(true).status(200);
          }

          return res.json({
            'message': 'Program not valid',
          }).status(400);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.delete(
      '/:uid/delete',
      this.withToken.middleware(),
      this.requireUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programService.findOneByUser(req.user, req.params.id)
          if (!program) {
            throw new Exception('Program not found', 404);
          }

          await this.programService.remove(program)

          return res.json(true).status(200);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app;
  }
};
