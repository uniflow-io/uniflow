import {NextFunction, Request, Response, Router} from 'express';
import { Service } from 'typedi';
import { ControllerInterface } from '../type';

@Service()
export default class VersionController implements ControllerInterface {
  routes(app: Router): Router {
    app.get(
      '/version',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          return res.json({
            version: `v${require('../../../package.json').version}`
          }).status(200);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      }
    );

    return app
  }
};
