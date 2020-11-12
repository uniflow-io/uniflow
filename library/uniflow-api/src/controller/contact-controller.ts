import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from "typedi";
import { ContactService } from "../service";
import { ContactEntity } from "../entity";
import { ControllerInterface } from './interfaces';

@Service()
export default class ContactController implements ControllerInterface {
  constructor(
    private contactService: ContactService
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/contacts', route);

    route.post(
      '/',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
          message: Joi.string().required(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const contact = req.body as ContactEntity;
    
          if(await this.contactService.isValid(contact)) {
            await this.contactService.save(contact)
            await this.contactService.send(contact)
    
            return res.status(201).json(true);
          }
    
          return res.status(400).json({
            'messages': ['Contact not valid'],
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
