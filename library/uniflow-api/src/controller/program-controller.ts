import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router} from 'express';
import { Service} from "typedi";
import { ProgramService, ProgramClientService, ProgramTagService, FolderService } from "../service";
import { ProgramEntity } from "../entity";
import { RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { ApiException } from "../exception";
import { ControllerInterface } from './interfaces';
import { FolderRepository, ProgramRepository, TagRepository } from '../repository';

@Service()
export default class ProgramController implements ControllerInterface {
  constructor(
    private folderRepository: FolderRepository,
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
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let programItems = []
          const programs = await this.programRepository.findPublic()
          for(const program of programs) {
            programItems.push({
              'name': program.name,
              'slug': program.slug,
              'path': await this.folderService.toPath(program.folder),
              'description': program.description,
              'username': program.user.username,
            })
          }

          return res.status(200).json({
            'programs': programItems
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      }
    );
  
    /*route.get(
      '/:username/programs',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          if(req.params.username === 'me' && !req.user) {
            throw new ApiException('Not authorized', 401);
          }
  
          let fetchUser = undefined
          if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
            fetchUser = req.user
          } else {
            fetchUser = await this.userService.findOneByUsername(req.params.username)
            if(!fetchUser) {
              throw new ApiException('User not found', 404);
            }
          }
  
          const client = req.params.client
          let programs = []
          if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
            programs = await this.programService.findLastByUserAndClient(fetchUser, client)
          } else {
            programs = await this.programService.findLastPublicByUserAndClient(fetchUser, client)
          }
  
          let data = []
          for(const program of programs) {
            let item = await this.programService.getJson(program)
            
            data.push(item)
          }
  
          return res.status(200).json(data);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      }
    );*/
    
    /*const treeRoute = async (req: Request, res: Response, next: NextFunction) => {
      try {
        if(req.params.username === 'me' && !req.user) {
          throw new ApiException('Not authorized', 401);
        }
        
        let fetchUser = undefined
        if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
          fetchUser = req.user
        } else {
          fetchUser = await this.userService.findOneByUsername(req.params.username)
          if(!fetchUser) {
            throw new ApiException('User not found', 404);
          }
        }
        
        const path = [
          req.params.slug1,
          req.params.slug2,
          req.params.slug3,
          req.params.slug4,
          req.params.slug5,
        ].filter((el) => {
          return !!el;
        })
        
        let parentFolder = undefined
        if(path.length > 0) {
          let program = await this.programService.findOneByUserAndPath(fetchUser, path)
          if (program) {
            parentFolder = program.folder
          } else {
            parentFolder = await this.folderService.findOneByUserAndPath(fetchUser, path)
            if(!parentFolder) {
              throw new ApiException('Program or Folder not found', 404);
            }
          }
        }
  
        const client = req.params.client
        let programs = []
        let folders: Folder[] = []
        if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
          programs = await this.programService.findLastByUserAndClientAndFolder(fetchUser, client, parentFolder)
          folders = await this.folderService.findByUserAndParent(fetchUser, parentFolder)
        } else {
          programs = await this.programService.findLastPublicByUserAndClientAndFolder(fetchUser, client, parentFolder)
        }
        
        let children = []
        for(const program of programs) {
          let item: any = await this.programService.getJson(program)
          item['type'] = 'program'
          children.push(item)
        }
        for(const folder of folders) {
          let item: any = await this.folderService.getJson(folder)
          item['type'] = 'folder'
          children.push(item)
        }
  
          return res.status(200).json({
          'folder': parentFolder ? await this.folderService.getJson(parentFolder) : null,
          'children': children
        });
      } catch (e) {
        //console.log(' error ', e);
        return next(e);
      }
    }
  
    route.get('/:username/tree/:slug1/:slug2/:slug3/:slug4/:slug5', this.withToken.middleware(), this.withUser.middleware(), treeRoute);
    route.get('/:username/tree/:slug1/:slug2/:slug3/:slug4', this.withToken.middleware(), this.withUser.middleware(), treeRoute);
    route.get('/:username/tree/:slug1/:slug2/:slug3', this.withToken.middleware(), this.withUser.middleware(), treeRoute);
    route.get('/:username/tree/:slug1/:slug2', this.withToken.middleware(), this.withUser.middleware(), treeRoute);
    route.get('/:username/tree/:slug1', this.withToken.middleware(), this.withUser.middleware(), treeRoute);
    route.get('/:username/tree', this.withToken.middleware(), this.withUser.middleware(), treeRoute);*/
    
    route.post(
      '/',
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
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = new ProgramEntity();
          program.name = req.body.name
          program.slug = await this.programService.generateUniqueSlug(req.user, req.body.slug)
          program.user = req.user
          program.folder = await this.folderRepository.findOneByUserAndPath(req.user, req.body.path)
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

    route.put(
      '/:uid',
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
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programRepository.findOneByUser(req.user, req.params.uid)
          if (!program) {
            throw new ApiException('Program not found', 404);
          }
          
          program.name = req.body.name
          if (req.body.slug && program.slug !== req.body.slug) {
            program.slug = await this.programService.generateUniqueSlug(req.user, req.body.slug)
          }
          program.user = req.user
          program.folder = await this.folderRepository.findOneByUserAndPath(req.user, req.body.path)
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

    route.get(
      '/:uid/flows',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programRepository.findOne(req.params.uid)
          if (!program) {
            throw new ApiException('Program not found', 404);
          }
          
          if(!program.public) {
            if(!req.user || program.user.id != req.user.id) {
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
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programRepository.findOneByUser(req.user, req.params.uid)
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

    route.delete(
      '/:uid',
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let program = await this.programRepository.findOneByUser(req.user, req.params.uid)
          if (!program) {
            throw new ApiException('Program not found', 404);
          }

          await this.programRepository.remove(program)

          return res.status(200).json(true);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app;
  }
};
