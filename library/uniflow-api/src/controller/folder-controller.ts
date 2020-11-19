import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { FolderService } from "../service";
import { ApiException } from "../exception";
import { ControllerInterface } from './interfaces';
import { FolderRepository } from '../repository';
import { TypeCheckerModel } from '../model';

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
          uid: Joi.string().custom(TypeCheckerModel.joiUuid)
        }),
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string().custom(TypeCheckerModel.joiSlug),
          path: Joi.string().custom(TypeCheckerModel.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderRepository.findOne({
            where: {user: req.user, uid: req.params.uid},
            relations: ['user', 'parent']
          })
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
          
          if(req.body.name) {
            folder.name = req.body.name
          }
          if(req.body.path) {
            folder.parent = await this.folderService.fromPath(req.user, req.body.path)
          }
          folder.user = req.user
          if (req.body.slug && folder.slug !== req.body.slug) {
            await this.folderService.setSlug(folder, req.body.slug)
          }
  
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
          uid: Joi.string().custom(TypeCheckerModel.joiUuid)
        })
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderRepository.findOne({user: req.user, uid: req.params.uid})
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
  
          await this.folderRepository.safeRemove(folder)
  
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
