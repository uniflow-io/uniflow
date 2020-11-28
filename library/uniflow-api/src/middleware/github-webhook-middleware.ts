import * as crypto from 'crypto'
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { ApiException } from "../exception";
import { MiddlewareInterface } from './interfaces';
import { ParamsConfig } from '../config';

// GitHub: X-Hub-Signature
// Gogs:   X-Gogs-Signature
const sigHeaderName = 'X-Hub-Signature'

@Service()
export default class GithubWebhookMiddleware implements MiddlewareInterface {
  constructor(
    private paramsConfig: ParamsConfig
  ) {}

  middleware(): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload = JSON.stringify(req.body)
        if (!payload) {
          throw new ApiException('Not authorized', 401);
        }

        const sig = req.get(sigHeaderName) || ''
        const hmac = crypto.createHmac('sha1', this.paramsConfig.getConfig().get('githubWebhookSecret'))
        const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
        const checksum = Buffer.from(sig, 'utf8')
        if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
          throw new ApiException('Not authorized', 401);
        }

        return next();
      } catch (e) {
        //console.log(e);
        return next(e);
      }
    }
  }
}