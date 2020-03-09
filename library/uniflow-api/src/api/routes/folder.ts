import {NextFunction, Request, Response, Router} from 'express';
import {requireUser, withToken, withUser} from "../middlewares";
import {Container} from "typedi";
import { FolderService } from "../../services";
import {Folder} from "../../models";
import {celebrate, Joi} from "celebrate";
import {Exception} from "../../exception";
import UserService from "../../services/user";

const route = Router();

export default (app: Router) => {
  app.use('/folder', route);

  route.get(
    '/:username/tree',
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
        console.log(' error ', e);
        return next(e);
      }
    },
  );
  
  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        name: Joi.string(),
        slug: Joi.string(),
        path: Joi.array(),
      }),
    }),
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const folderService = Container.get(FolderService);
        
        let folder = new Folder();
        folder.name = req.body.name
        folder.slug = await folderService.generateUniqueSlug(req.user, req.body.slug)
        folder.parent = await folderService.findOneByUserAndPath(req.user, req.body.path)
        folder.user = req.user
  
        if(await folderService.isValid(folder)) {
          await folderService.save(folder)
  
          return res.json(await folderService.getJson(folder)).status(200);
        }
  
        return res.json({
          'message': 'Folder not valid',
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
      }),
    }),
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const folderService = Container.get(FolderService);

        let folder = await folderService.findOneByUser(req.user, req.params.id)
        if (!folder) {
          throw new Exception('Folder not found', 404);
        }
        
        folder.name = req.body.name
        if (req.body.slug && folder.slug !== req.body.slug) {
          folder.slug = await folderService.generateUniqueSlug(req.user, req.body.slug)
        }
        folder.parent = await folderService.findOneByUserAndPath(req.user, req.body.path)
        folder.user = req.user

        if(await folderService.isValid(folder)) {
          await folderService.save(folder)

          return res.json(await folderService.getJson(folder)).status(200);
        }

        return res.json({
          'message': 'Folder not valid',
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
        const folderService = Container.get(FolderService);

        let folder = await folderService.findOneByUser(req.user, req.params.id)
        if (!folder) {
          throw new Exception('Folder not found', 404);
        }

        await folderService.remove(folder)

        return res.json(true).status(200);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
