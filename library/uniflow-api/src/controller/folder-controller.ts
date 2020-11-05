import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { RequireUserMiddleware, WithTokenMiddleware } from "../middleware";
import { FolderService } from "../service";
import { FolderEntity } from "../entity";
import { Exception } from "../exception";
import { ControllerInterface } from './interfaces';

@Service()
export default class FolderController implements ControllerInterface {
  constructor(
    private folderService: FolderService,
    private withToken: WithTokenMiddleware,
    private requireUser: RequireUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

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
      this.withToken.middleware(),
      this.requireUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let folder = new FolderEntity();
          folder.name = req.body.name
          folder.slug = await this.folderService.generateUniqueSlug(req.user, req.body.slug)
          folder.parent = await this.folderService.findOneByUserAndPath(req.user, req.body.path)
          folder.user = req.user
    
          if(await this.folderService.isValid(folder)) {
            await this.folderService.save(folder)
    
            return res.status(200).json(await this.folderService.getJson(folder));
          }
    
          return res.status(400).json({
            'message': 'Folder not valid',
          });
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
        }),
      }),
      this.withToken.middleware(),
      this.requireUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let folder = await this.folderService.findOneByUser(req.user, req.params.id)
          if (!folder) {
            throw new Exception('Folder not found', 404);
          }
          
          folder.name = req.body.name
          if (req.body.slug && folder.slug !== req.body.slug) {
            folder.slug = await this.folderService.generateUniqueSlug(req.user, req.body.slug)
          }
          folder.parent = await this.folderService.findOneByUserAndPath(req.user, req.body.path)
          folder.user = req.user
  
          if(await this.folderService.isValid(folder)) {
            await this.folderService.save(folder)
  
            return res.status(200).json(await this.folderService.getJson(folder));
          }
  
          return res.status(400).json({
            'message': 'Folder not valid',
          });
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
          let folder = await this.folderService.findOneByUser(req.user, req.params.id)
          if (!folder) {
            throw new Exception('Folder not found', 404);
          }
  
          await this.folderService.remove(folder)
  
          return res.status(200).json(true);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}
