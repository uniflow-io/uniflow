import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { Operation } from "express-openapi";
import { ControllerInterface, ControllerOperations } from './interfaces';

@Service()
export default class VersionController implements ControllerInterface {
  basePath(): string {
    return '/'
  }

  operations(): ControllerOperations {
    return {
      '/version': {
        get: (() => {
          const operation: Operation = async (req: Request, res: Response, next: NextFunction) => {
            try {
              return res.status(200).json({
                version: `v${require('../../package.json').version}`
              });
            } catch (e) {
              return next(e);
            }
          }
      
          operation.apiDoc = {
            description: 'Get API Version.',
            operationId: 'getVersion',
            responses: {
              200: {
                description: 'Get API Version',
              },
            },
          }
          return operation
        })()
      }
    }
  }
};
