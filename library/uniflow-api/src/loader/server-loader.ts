import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { Service } from 'typedi';
import { NextFunction, Request, Response } from "express";
import { ValidateError } from '@tsoa/runtime';
import { AppConfig } from '../config';
import { LoaderInterface } from './interfaces';
import { RegisterRoutes } from '../routes';

@Service()
export default class ServerLoader implements LoaderInterface {
  private app: express.Application;

  constructor(
    private appConfig: AppConfig
  ) {}

	public getApp(): express.Application {
		return this.app;
	}

  public async load() {
    this.app = express()
    this.app.enable('trust proxy');
    this.app.use(cors({
      "origin": this.appConfig.getConfig().get('corsAllowOrigin')
    }));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
  
    RegisterRoutes(this.app)
    this.app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
      return res.send(
        swaggerUi.generateHTML(await import(`${__dirname}/../../dist/swagger.json`))
      );
    })
    this.app.use('/', express.static('./public'))
  
    /// catch 404 and forward to error handler
    this.app.use((req: Request, re: Response, next: NextFunction) => {
      const error: any = new Error('Not found');
      error['status'] = 404;
      next(error);
    });
  
    /// error handlers
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      /**
       * Handle validation error thrown by tsoa
       */
      if (err instanceof ValidateError) {
        const validation: any = [];
        for (const [path, error] of Object.entries(err.fields)) {
          validation.push({
            source: path.split('.').slice(0, -1).join('.'),
            key: path.split('.').slice(-1).join('.'),
            messages: [error.message],
          })
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
      let message = err.message
      const status = err.status || 500
      // console.log(err)
      if(status >= 500 && this.appConfig.getConfig().get('env') !== 'development') {
        message = "Internal Server Error"
      }
      
      res
        .status(status)
        .json({ messages: [message] })
        .end();
    });
  }
}
