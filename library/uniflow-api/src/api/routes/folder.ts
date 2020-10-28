import {NextFunction, Request, Response, Router} from 'express';
import {requireUser, withToken} from "../middlewares";
import {Container} from "typedi";
import { FolderService } from "../../services";
import {Folder} from "../../models";
import { celebrate, Joi, Segments } from 'celebrate';
import {Exception} from "../../exception";

const route = Router();

export default (app: Router) => {
  app.use('/folders', route);
  
  route.post(
    '/create',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
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
    '/:uid/update',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
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
    '/:uid/delete',
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
