import { celebrate, CelebrateError, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { FolderService } from "../service";
import { ApiException } from "../exception";
import { ControllerInterface } from './interfaces';
import { FolderRepository } from '../repository';
import { TypeModel } from '../model';

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
          uid: Joi.string().custom(TypeModel.joiUuid)
        }),
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string(),
          path: Joi.string().custom(TypeModel.joiPath),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderRepository.findOne({
            where: {user: req.appUser, uid: req.params.uid},
            relations: ['user', 'parent']
          })
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
          
          if(req.body.name) {
            folder.name = req.body.name
          }
          if(req.appUser && req.body.path) {
            const parentFolder = await this.folderService.fromPath(req.appUser, req.body.path) || null
            if(parentFolder && await this.folderRepository.isCircular(folder, parentFolder)) {
              const error = new CelebrateError(undefined, { celebrated: true })
              error.details.set(Segments.BODY, new Joi.ValidationError('', [{path: ['path'], message: 'path provided is not accepted'}], ''))
              throw error
            }
            folder.parent = parentFolder
            await this.folderService.setSlug(folder, folder.slug) // in case of slug conflict when moving folder
          }
          if(req.appUser) {
            folder.user = req.appUser
          }
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
          uid: Joi.string().custom(TypeModel.joiUuid)
        })
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const folder = await this.folderRepository.findOne({user: req.appUser, uid: req.params.uid})
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
