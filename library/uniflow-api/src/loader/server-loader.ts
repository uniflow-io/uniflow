import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { initialize } from 'express-openapi';
import { Service } from 'typedi';
import { OpenAPIFrameworkPathObject } from 'openapi-framework'
import { AuthController, ContactController, FolderController, LeadController, ProgramController, UserController, VersionController } from '../controller';
import { NextFunction, Request, Response } from "express";
import { isCelebrateError } from 'celebrate';
import { ParamsConfig } from '../config';
import { LoaderInterface } from './interfaces';
import { ControllerInterface } from '../types';

@Service()
export default class ServerLoader implements LoaderInterface {
  private app: express.Application;

  constructor(
    private authController: AuthController,
    private contactController: ContactController,
    private folderController: FolderController,
    private leadController: LeadController,
    private programController: ProgramController,
    private userController: UserController,
    private versionController: VersionController,
    private paramsConfig: ParamsConfig
  ) {}

	public getApp(): express.Application {
		return this.app;
	}

  public async load() {
    this.app = express()
    this.app.enable('trust proxy');
    this.app.use(cors({
      "origin": this.paramsConfig.getConfig().get('corsAllowOrigin')
    }));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
  
    /*this.authController.routes(router);
    this.contactController.routes(router);
    this.folderController.routes(router);
    this.leadController.routes(router);
    this.programController.routes(router);
    ;*/
    const controllers: ControllerInterface[] = [
      this.userController,
      this.versionController
    ]
    const apiDoc = {
      swagger: '2.0',
      basePath: '/api',
      info: {
        title: 'Uniflow API.',
        version: require('../../package.json').version
      },
      paths: {}
    };
    initialize({
      app: this.app,
      apiDoc, 
      docsPath: '/docs',
      errorMiddleware: function(err, req, res, next) { // only handles errors for /v3/*
        //console.log(' error ', err);
        return next(err);
      },
      paths: controllers.reduce((paths: OpenAPIFrameworkPathObject[], controller: ControllerInterface) => {
        for(const [path, operation] of Object.entries(controller.operations())) {
          paths.push({
            path: `${controller.basePath() === '/' ? '' : controller.basePath()}${path}`,
            module: operation
          })
        }
        return paths
      }, [])
    })
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, {
      swaggerOptions: {
        url: '/api/docs'
      }
    }));
    this.app.use('/', express.static('./public'));
  
    /// catch 404 and forward to error handler
    this.app.use((req: Request, re: Response, next: NextFunction) => {
      const error: any = new Error('Not Found');
      error['status'] = 404;
      next(error);
    });
  
    /// error handlers
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      /**
       * Handle 401 thrown by express-jwt library
       */
      if (err.name === 'UnauthorizedError') {
        return res
          .status(err.status)
          .send({ messages: [err.message] })
          .end();
      }
  
      /**
       * Handle validation error thrown by Celebrate + Joi
       */
      if (isCelebrateError(err)) {
        const validation: any = [];
        for (const [segment, joiError] of err.details.entries()) {
          for (const joiErrorItem of joiError.details) {
            validation.push({
              source: segment,
              key: joiErrorItem.path.join('.'),
              messages: [joiErrorItem.message],
            })
          }
        }

        return res
          .status(422)
          .send({
            messages: [err.message],
            validation: validation,
          })
          .end();
      }
      return next(err);
    });
  
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res
        .status(err.status || 500)
        .json({ messages: [err.message] })
        .end();
    });
  }
}
