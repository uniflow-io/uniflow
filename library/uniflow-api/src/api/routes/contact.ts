import {NextFunction, Request, Response, Router} from 'express';
import {Container} from "typedi";
import { ContactService } from "../../services";
import {Contact} from "../../models";
import {celebrate, Joi} from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/contact', route);

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        email: Joi.string(),
        message: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contactService = Container.get(ContactService);
        
        const contact = req.body as Contact;
  
        if(await contactService.isValid(contact)) {
          await contactService.save(contact)
          await contactService.send(contact)
  
          return res.json(true).status(200);
        }
  
        return res.json({
          'message': 'Contact not valid',
        }).status(400);
      } catch (e) {
        console.log(' error ', e);
        return next(e);
      }
    },
  );
};
