import {NextFunction, Request, Response, Router} from 'express';
import {requireUser, withToken} from "../middlewares";
import {Container} from "typedi";
import { ConfigService } from "../../services";
import {Config} from "../../models";

const route = Router();

export default (app: Router) => {
  app.use('/config', route);

  route.get(
    '/get-config',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configService = Container.get(ConfigService);
        
        let config = await configService.findOne();
        if(!config) {
          config = new Config()
        }
        
        return res.json(await configService.getJson(config)).status(200);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );

  route.put(
    '/set-config',
    withToken,
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configService = Container.get(ConfigService);
  
        let config = await configService.findOne();
        if(!config) {
          config = new Config()
        }
  
        if(await configService.isValid(config)) {
          await configService.save(config)
  
          return res.json(await configService.getJson(config)).status(200);
        }
  
        return res.json({
          'message': 'Config not valid',
        }).status(400);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
