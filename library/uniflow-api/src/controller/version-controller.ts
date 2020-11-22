import {NextFunction, Request, Response, Router} from 'express';
import { Service } from 'typedi';
import { ControllerInterface } from './interfaces';

@Service()
export default class VersionController implements ControllerInterface {
  routes(app: Router): Router {
    app.get(
      '/version',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          return res.status(200).json({
            version: `v${require('../../package.json').version}`
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      }
    );

    return app
  }
};
