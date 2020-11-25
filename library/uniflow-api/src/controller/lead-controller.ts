import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { LeadService } from "../service";
import { ControllerInterface } from './interfaces';

@Service()
export default class LeadController implements ControllerInterface {
  constructor(
    private leadService: LeadService
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/leads', route);
  
    route.post(
      '/',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const lead = await this.leadService.subscribe(req.body.email, {
            types: ['newsletter','blog']
          })

          if(await this.leadService.isValid(req.body.email)) {    
            return res.status(201).json(await this.leadService.getJson(lead));
          }
    
          return res.status(400).json({
            'messages': ['Lead not valid'],
          });
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}
