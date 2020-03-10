import {NextFunction, Request, Response, Router} from 'express';

export default (app: Router) => {
  app.get(
    '/version',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.json({
          version: `v${require('../../../package.json').version}`
        }).status(200);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    }
  );
};
