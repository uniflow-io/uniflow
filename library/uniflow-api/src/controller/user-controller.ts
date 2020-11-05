import { Service} from "typedi";
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router} from 'express';
import { RequireUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { UserService, FolderService, ConfigService, ProgramService } from "../service";
import { ConfigEntity } from "../entity";
import { Exception } from "../exception";
import { ControllerInterface } from './interfaces';

@Service()
export default class UserController implements ControllerInterface {
  constructor(
    private folderService: FolderService,
    private programService: ProgramService,
    private userService: UserService,
    private configService: ConfigService,
    private withToken: WithTokenMiddleware,
    private requireUser: RequireUserMiddleware,
    private withUser: WithUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/users', route);

    route.get(
      '/:uid/settings',
      this.withToken.middleware(),
      this.requireUser.middleware('ROLE_USER', true),
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
      this.requireUser.middleware('ROLE_USER', true),
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
            'message': 'User not valid',
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
      this.requireUser.middleware('ROLE_SUPER_ADMIN', true),
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
      this.requireUser.middleware('ROLE_SUPER_ADMIN', true),
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
            'message': 'Config not valid',
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );
  
    route.get(
      '/:username/programs',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          if(req.params.username === 'me' && !req.user) {
            throw new Exception('Not authorized', 401);
          }
  
          let fetchUser = undefined
          if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
            fetchUser = req.user
          } else {
            fetchUser = await this.userService.findOneByUsername(req.params.username)
            if(!fetchUser) {
              throw new Exception('User not found', 404);
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
    );
    
    /*const treeRoute = async (req: Request, res: Response, next: NextFunction) => {
      try {
        if(req.params.username === 'me' && !req.user) {
          throw new Exception('Not authorized', 401);
        }
        
        let fetchUser = undefined
        if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
          fetchUser = req.user
        } else {
          fetchUser = await this.userService.findOneByUsername(req.params.username)
          if(!fetchUser) {
            throw new Exception('User not found', 404);
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
              throw new Exception('Program or Folder not found', 404);
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
  
    route.get(
      '/:username/folders',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let fetchUser = undefined
          if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
            fetchUser = req.user
          } else {
            fetchUser = await this.userService.findOneByUsername(req.params.username)
            if(!fetchUser) {
              throw new Exception('User not found', 404);
            }
          }
          
          let data: string[][] = [[]]
          const folders = await this.folderService.findByUser(fetchUser)
          for (const folder of folders) {
            data.push(await this.folderService.toPath(folder))
          }
          data.sort((path1, path2) => {
            return path1.join('/').localeCompare(path2.join('/'))
          })
  
          return res.status(400).json(data);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}
