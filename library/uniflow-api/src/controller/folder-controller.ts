import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { RequireRoleUserMiddleware, WithTokenMiddleware, WithUserMiddleware } from "../middleware";
import { FolderService } from "../service";
import { FolderEntity } from "../entity";
import { ApiException } from "../exception";
import { ControllerInterface } from './interfaces';
import { FolderRepository, UserRepository } from '../repository';

@Service()
export default class FolderController implements ControllerInterface {
  constructor(
    private userRepository: UserRepository,
    private folderRepository: FolderRepository,
    private folderService: FolderService,
    private withToken: WithTokenMiddleware,
    private withUser: WithUserMiddleware,
    private requireRoleUser: RequireRoleUserMiddleware
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/folders', route);
  
    route.get(
      '/',
      this.withToken.middleware(),
      this.withUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let fetchUser = undefined
          if(req.user && (req.params.username === 'me' || req.params.username === req.user.username)) {
            fetchUser = req.user
          } else {
            fetchUser = await this.userRepository.findOne({username: req.params.username})
            if(!fetchUser) {
              throw new ApiException('User not found', 404);
            }
          }
          
          let data: string[][] = [[]]
          const folders = await this.folderRepository.findByUser(fetchUser)
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

    route.post(
      '/',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string().required(),
          slug: Joi.string(),
          path: Joi.array(),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let folder = new FolderEntity();
          folder.name = req.body.name
          folder.slug = await this.folderService.generateUniqueSlug(req.user, req.body.slug || req.body.name)
          folder.parent = await this.folderRepository.findOneByUserAndPath(req.user, req.body.path || [])
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
  
    route.put(
      '/:uid',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string(),
          slug: Joi.string(),
          path: Joi.array(),
        }),
      }),
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let folder = await this.folderRepository.findOneByUser(req.user, req.params.uid)
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
          
          if(req.body.name) {
            folder.name = req.body.name
          }
          
          if (req.body.slug && folder.slug !== req.body.slug) {
            folder.slug = await this.folderService.generateUniqueSlug(req.user, req.body.slug)
          }
          folder.parent = await this.folderRepository.findOneByUserAndPath(req.user, req.body.path)
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
      this.withToken.middleware(),
      this.withUser.middleware(),
      this.requireRoleUser.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let folder = await this.folderRepository.findOneByUser(req.user, req.params.uid)
          if (!folder) {
            throw new ApiException('Folder not found', 404);
          }
  
          await this.folderRepository.remove(folder)
  
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
