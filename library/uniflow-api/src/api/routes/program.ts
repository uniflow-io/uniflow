import {NextFunction, Request, Response, Router} from 'express';
import {requireUser, withToken, withUser} from "../middlewares";
import {Container} from "typedi";
import { ProgramService, ProgramClientService, ProgramTagService, UserService, FolderService, ClientService, TagService } from "../../services";
import {Folder, Program} from "../../models";
import {celebrate, Joi} from "celebrate";
import {Exception} from "../../exception";

const route = Router();

export default (app: Router) => {
  app.use('/program', route);

  route.get(
    '/:username/list',
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
        console.log(' error ', e);
        return next(e);
      }
    }
  );
  
  const treeRoute = async (req: Request, res: Response, next: NextFunction) => {
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
      let folders = []
      if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
        programs = await programService.findLastByUserAndClientAndFolder(fetchUser, client, parentFolder)
        folders = await folderService.findByUserAndParent(fetchUser, parentFolder)
      } else {
        programs = await programService.findLastPublicByUserAndClientAndFolder(fetchUser, client, parentFolder)
      }
      
      let children = []
      for(const program of programs) {
        let item = await programService.getJson(program)
        item['type'] = 'program'
        children.push(item)
      }
      for(const folder of folders) {
        let item = await folderService.getJson(folder)
        item['type'] = 'folder'
        children.push(item)
      }

        return res.json({
        'folder': parentFolder ? await folderService.getJson(parentFolder) : null,
        'children': children
      }).status(200);
    } catch (e) {
      console.log(' error ', e);
      return next(e);
    }
  }

  route.get('/:username/tree/:slug1/:slug2/:slug3/:slug4/:slug5', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1/:slug2/:slug3/:slug4', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1/:slug2/:slug3', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1/:slug2', withToken, withUser, treeRoute);
  route.get('/:username/tree/:slug1', withToken, withUser, treeRoute);
  route.get('/:username/tree', withToken, withUser, treeRoute);


  route.get(
    '/last-public',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programService = Container.get(ProgramService);
        const folderService = Container.get(FolderService);

        let programItems = []
        const programs = await programService.findLastPublic(15)
        for(const program of programs) {
          programItems.push({
            'name': program.name,
            'slug': program.slug,
            'path': await folderService.toPath(program.folder),
            'description': program.description,
            'username': program.user.username,
          })
        }

        return res.json({
          'programs': programItems
        }).status(200);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    }
  );
  
  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        name: Joi.string(),
        slug: Joi.string(),
        path: Joi.array(),
        clients: Joi.array(),
        tags: Joi.array(),
        description: Joi.string().allow(null, ''),
        public: Joi.boolean(),
      }),
    }),
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programService = Container.get(ProgramService);
        const programClientService = Container.get(ProgramClientService);
        const programTagService = Container.get(ProgramTagService);
        const folderService = Container.get(FolderService);
        const tagService = Container.get(TagService);

        let program = new Program();
        program.name = req.body.name
        program.slug = await programService.generateUniqueSlug(req.user, req.body.slug)
        program.user = req.user
        program.folder = await folderService.findOneByUserAndPath(req.user, req.body.path)
        program.clients = await programClientService.manageByProgramAndClientNames(program, req.body.clients)
        program.tags = await programTagService.manageByProgramAndTagNames(program, req.body.tags)
        program.description = req.body.description
        program.public = req.body.public

        if(await programService.isValid(program)) {
          await programService.save(program)
          await tagService.clear()

          return res.json(await programService.getJson(program)).status(200);
        }

        return res.json({
          'message': 'Program not valid',
        }).status(400);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.put(
    '/update/:id',
    celebrate({
      body: Joi.object({
        name: Joi.string(),
        slug: Joi.string(),
        path: Joi.array(),
        clients: Joi.array(),
        tags: Joi.array(),
        description: Joi.string().allow(null, ''),
        public: Joi.boolean(),
      }),
    }),
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programService = Container.get(ProgramService);
        const programClientService = Container.get(ProgramClientService);
        const programTagService = Container.get(ProgramTagService);
        const folderService = Container.get(FolderService);
        const tagService = Container.get(TagService);

        let program = await programService.findOneByUser(req.user, req.params.id)
        if (!program) {
          throw new Exception('Program not found', 404);
        }
        
        program.name = req.body.name
        if (req.body.slug && program.slug !== req.body.slug) {
          program.slug = await programService.generateUniqueSlug(req.user, req.body.slug)
        }
        program.user = req.user
        program.folder = await folderService.findOneByUserAndPath(req.user, req.body.path)
        program.clients = await programClientService.manageByProgramAndClientNames(program, req.body.clients)
        program.tags = await programTagService.manageByProgramAndTagNames(program, req.body.tags)
        program.description = req.body.description
        program.public = req.body.public

        if(await programService.isValid(program)) {
          await programService.save(program)
          await tagService.clear()

          return res.json(await programService.getJson(program)).status(200);
        }

        return res.json({
          'message': 'Program not valid',
        }).status(400);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.get(
    '/get-data/:id',
    withToken,
    withUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programService = Container.get(ProgramService);

        let program = await programService.findOne(req.params.id)
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
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.put(
    '/set-data/:id',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programService = Container.get(ProgramService);

        let program = await programService.findOneByUser(req.user, req.params.id)
        if (!program) {
          throw new Exception('Program not found', 404);
        }

        program.data = req.body.data

        if(await programService.isValid(program)) {
          await programService.save(program)

          return res.json(true).status(200);
        }

        return res.json({
          'message': 'Program not valid',
        }).status(400);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.delete(
    '/delete/:id',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programService = Container.get(ProgramService);

        let program = await programService.findOneByUser(req.user, req.params.id)
        if (!program) {
          throw new Exception('Program not found', 404);
        }

        await programService.remove(program)

        return res.json(true).status(200);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
