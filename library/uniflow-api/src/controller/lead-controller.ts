import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, response, Response, Router } from 'express';
import { Inject, Service } from "typedi";
import { ParamsConfig } from '../config';
import { ApiException } from '../exception';
import { LeadFactory } from '../factory';
import { GithubWebhookMiddleware } from '../middleware';
import { TypeModel } from '../model';
import { LeadRepository } from '../repository';
import { LeadService } from "../service";
import { LeadSubscriberInterface } from '../service/lead-subscriber/interfaces';
import { RequestInterface } from '../service/request/interfaces';
import { ControllerInterface, GithubUser } from './interfaces';

@Service()
export default class LeadController implements ControllerInterface {
  constructor(
    private leadService: LeadService,
    private leadRepository: LeadRepository,
    private leadFactory: LeadFactory,
    @Inject('LeadSubscriberInterface')
    private leadSubscriber: LeadSubscriberInterface,
    private githubWebhookMiddleware: GithubWebhookMiddleware,
    private paramsConfig: ParamsConfig,
    @Inject('RequestInterface')
    private request: RequestInterface,
  ) {}

  routes(app: Router): Router {
    const route = Router();

    app.use('/leads', route);
  
    route.post(
      '/',
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
          optinNewsletter: Joi.boolean(),
          optinBlog: Joi.boolean(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const lead = await this.leadFactory.create(await this.leadRepository.findOne({email: req.body.email}) || {email: req.body.email})

          if(req.body.optinNewsletter || req.body.optinNewsletter === false) {
            lead.optinNewsletter = req.body.optinNewsletter
          }

          if(req.body.optinBlog || req.body.optinBlog === false) {
            lead.optinBlog = req.body.optinBlog
          }

          if(await this.leadService.isValid(lead) && (lead.optinNewsletter || lead.optinBlog)) { // ensure lead creation only if one optin is true
            await this.leadRepository.save(lead) //ensure lead uid is defined before subscribing
            await this.leadSubscriber.update(lead)
            await this.leadRepository.save(lead)

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

    route.get(
      '/:uid',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeModel.joiUuid)
        })
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const lead = await this.leadRepository.findOne({uid: req.params.uid})
          if (!lead) {
            throw new ApiException('Lead not found', 404);
          }

          return res.status(200).json(await this.leadService.getJson(lead));
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    route.put(
      '/:uid',
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          uid: Joi.string().custom(TypeModel.joiUuid)
        }),
        [Segments.BODY]: Joi.object().keys({
          optinNewsletter: Joi.boolean(),
          optinBlog: Joi.boolean(),
          optinGithub: Joi.boolean(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const lead = await this.leadRepository.findOne({uid: req.params.uid})
          if (!lead) {
            throw new ApiException('Lead not found', 404);
          }

          if(req.body.optinNewsletter || req.body.optinNewsletter === false) {
            lead.optinNewsletter = req.body.optinNewsletter
          }

          if(req.body.optinBlog || req.body.optinBlog === false) {
            lead.optinBlog = req.body.optinBlog
          }

          if(lead.githubUsername && (req.body.optinGithub || req.body.optinGithub === false)) {
            lead.optinGithub = req.body.optinGithub
          }

          if(await this.leadService.isValid(lead)) {
            await this.leadRepository.save(lead) //ensure lead uid is defined before subscribing
            await this.leadSubscriber.update(lead)
            await this.leadRepository.save(lead)

            return res.status(200).json(await this.leadService.getJson(lead));
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

    route.post(
      '/github-webhook',
      this.githubWebhookMiddleware.middleware(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          //create a new lead if receive github star from github webhook !
          const githubEmailToken = this.paramsConfig.getConfig().get('githubEmailToken')
          if(req.body.action === 'created' && req.body.sender.login && githubEmailToken) {
            // retrive github user email with a personal github access token
            const githubResponse = await this.request.get(`https://api.github.com/users/${req.body.sender.login}`, {
              headers: {
                Authorization: `token ${githubEmailToken}`,
              }
            })
            const githubUser = githubResponse.data as GithubUser
            if(githubUser && githubUser.email && githubUser.login) {
              const lead = await this.leadFactory.create(await this.leadRepository.findOne({email: githubUser.email}) || {email: githubUser.email})
              lead.githubUsername = githubUser.login
              lead.optinGithub = true

              if(await this.leadService.isValid(lead)) {
                await this.leadRepository.save(lead) //ensure lead uid is defined before subscribing
                await this.leadSubscriber.update(lead)
                await this.leadRepository.save(lead)

                return res.status(201).json(await this.leadService.getJson(lead));
              }
            }
          }

          return res.status(201).json(true);
        } catch (e) {
          //console.log(' error ', e);
          return next(e);
        }
      },
    );

    return app
  }
}
