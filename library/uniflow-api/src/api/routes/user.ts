import {NextFunction, Request, Response, Router} from 'express';
import {requireUser, withToken, withUser} from "../middlewares";
import {Container} from "typedi";
import { UserService, FolderService, ConfigService, ProgramService } from "../../services";
import { Config, Folder } from "../../entities";
import { celebrate, Joi, Segments } from 'celebrate';
import {Exception} from "../../exception";

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get(
    '/:uid/settings',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = Container.get(UserService);
        
        return res.json(await userService.getJson(req.user)).status(200);
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
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = Container.get(UserService);
  
        if(req.body.username && req.body.username !== req.user.username) {
          req.body.username = await userService.generateUniqueUsername(req.body.username)
        }
        
        let user = Object.assign(req.user, req.body);
  
        if(await userService.isValid(user)) {
          await userService.save(user)
  
          return res.json(await userService.getJson(user)).status(200);
        }
  
        return res.json({
          'message': 'User not valid',
        }).status(400);
      } catch (e) {
        //console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.get(
    '/:uid/config',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configService = Container.get(ConfigService);
        
        let config = await configService.findOne();
        if(!config) {
          config = new Config()
        }
        
        return res.json(await configService.getJson(config)).status(200);
      } catch (e) {
        //console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.put(
    '/:uid/config',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configService = Container.get(ConfigService);
  
        let config = await configService.findOne();
        if(!config) {
          config = new Config()
        }
  
        if(await configService.isValid(config)) {
          await configService.save(config)
  
          return res.json(await configService.getJson(config)).status(200);
        }
  
        return res.json({
          'message': 'Config not valid',
        }).status(400);
      } catch (e) {
        //console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.get(
    '/:username/programs',
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = Container.get(UserService);
        const programService = Container.get(ProgramService);

        if(req.params.username === 'me' && !req.user) {
          throw new Exception('Not authorized', 401);
        }

        let fetchUser = undefined
        if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
          fetchUser = req.user
        } else {
          fetchUser = await userService.findOneByUsername(req.params.username)
          if(!fetchUser) {
            throw new Exception('User not found', 404);
          }
        }

        const client = req.params.client
        let programs = []
        if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
          programs = await programService.findLastByUserAndClient(fetchUser, client)
        } else {
          programs = await programService.findLastPublicByUserAndClient(fetchUser, client)
        }

        let data = []
        for(const program of programs) {
          let item = await programService.getJson(program)
          
          data.push(item)
        }

        return res.json(data).status(200);
      } catch (e) {
        //console.log(' error ', e);
        return next(e);
      }
    }
  );
  
  /*const treeRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userService = Container.get(UserService);
      const programService = Container.get(ProgramService);
      const folderService = Container.get(FolderService);
      
      if(req.params.username === 'me' && !req.user) {
        throw new Exception('Not authorized', 401);
      }
      
      let fetchUser = undefined
      if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
        fetchUser = req.user
      } else {
        fetchUser = await userService.findOneByUsername(req.params.username)
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
        let program = await programService.findOneByUserAndPath(fetchUser, path)
        if (program) {
          parentFolder = program.folder
        } else {
          parentFolder = await folderService.findOneByUserAndPath(fetchUser, path)
          if(!parentFolder) {
            throw new Exception('Program or Folder not found', 404);
          }
        }
      }

      const client = req.params.client
      let programs = []
      let folders: Folder[] = []
      if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
        programs = await programService.findLastByUserAndClientAndFolder(fetchUser, client, parentFolder)
        folders = await folderService.findByUserAndParent(fetchUser, parentFolder)
      } else {
        programs = await programService.findLastPublicByUserAndClientAndFolder(fetchUser, client, parentFolder)
      }
      
      let children = []
      for(const program of programs) {
        let item: any = await programService.getJson(program)
        item['type'] = 'program'
        children.push(item)
      }
      for(const folder of folders) {
        let item: any = await folderService.getJson(folder)
        item['type'] = 'folder'
        children.push(item)
      }

        return res.json({
        'folder': parentFolder ? await folderService.getJson(parentFolder) : null,
        'children': children
      }).status(200);
    } catch (e) {
      //console.log(' error ', e);
      return next(e);
    }
  }

  route.get('/:username/tree/:slug1/:slug2/:slug3/:slug4/:slug5', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1/:slug2/:slug3/:slug4', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1/:slug2/:slug3', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1/:slug2', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1', withToken, withUser, treeRoute);
  route.get('/:username/tree', withToken, withUser, treeRoute);*/

  route.get(
    '/:username/folders',
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const folderService = Container.get(FolderService);
        const userService = Container.get(UserService);

        let fetchUser = undefined
        if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
          fetchUser = req.user
        } else {
          fetchUser = await userService.findOneByUsername(req.params.username)
          if(!fetchUser) {
            throw new Exception('User not found', 404);
          }
        }
        
        let data: string[][] = [[]]
        const folders = await folderService.findByUser(fetchUser)
        for (const folder of folders) {
          data.push(await folderService.toPath(folder))
        }
        data.sort((path1, path2) => {
          return path1.join('/').localeCompare(path2.join('/'))
        })

        return res.json(data).status(400);
      } catch (e) {
        //console.log(' error ', e);
        return next(e);
      }
    },
  );
};
