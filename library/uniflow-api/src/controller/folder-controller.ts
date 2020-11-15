import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { FolderService } from "../service";
import { ApiException } from "../exception";
import { ControllerInterface } from './interfaces';
import { FolderRepository } from '../repository';
import { TypeChecker } from '../model';

@Service()
export default class FolderController implements ControllerInterface {
  constructor(
    private folderRepository: FolderRepository,
    private folderService: FolderService,
    private withToken: WithTokenMiddleware,
    private withUser: WithUserMiddleware,
    private requireRoleUser: RequireRoleUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/folders', route);
  
    route.put(
      '/:uid',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuid)
        }),
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string().custom(TypeChecker.joiSlug),
          path: Joi.string().custom(TypeChecker.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderRepository.findOneByUserAndUid(req.user, req.params.uid)
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
          
          folder.name = req.body.name
          folder.parent = await this.folderService.fromPath(req.user, req.body.path)
          if (req.body.slug && folder.slug !== req.body.slug) {
            folder.slug = await this.folderService.generateUniqueSlug(req.body.slug, req.user, folder.parent)
          }
          folder.user = req.user
  
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
  
    route.delete(
      '/:uid',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeChecker.joiUuid)
        })
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderRepository.findOneByUserAndUid(req.user, req.params.uid)
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
  
          await this.folderService.delete(folder)
  
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
