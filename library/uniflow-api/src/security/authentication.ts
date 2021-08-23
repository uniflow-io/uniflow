import * as express from "express";
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken';
import Container from "../container";
import { ApiException } from "../exception";
import { AppConfig } from '../config';
import { UserRepository } from '../repository';
import { UserService } from '../service';
import { UserEntity } from "../entity";
import { ROLE } from "../model/api-type-interface";

export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
  ): Promise<any> {
    const container = new Container()
    const params = container.get(AppConfig)
    const userRepository = container.get(UserRepository)
    const userService = container.get(UserService)
    
    if (securityName === "github_token") {
      const payload = JSON.stringify(request.body)
      if (!payload) {
        return Promise.reject(new ApiException('Not authorized', 401))
      }
      
      const sigHeaderName = 'X-Hub-Signature'
      const sig = request.get(sigHeaderName) || ''
      const hmac = crypto.createHmac('sha1', params.getConfig().get('githubWebhookSecret'))
      const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
      const checksum = Buffer.from(sig, 'utf8')
      if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        return Promise.reject(new ApiException('Not authorized', 401))
      }

      return Promise.resolve(undefined)
    } else if (securityName === "role") {
      const user: UserEntity|undefined = await new Promise((resolve, reject) => {
        if (request.headers['uniflow-authorization']) {
          const authorization = request.headers['uniflow-authorization'] as string
          if(authorization.split(' ')[0] === 'Bearer') {
            const token = authorization.split(' ')[1]
            jwt.verify(token, params.getConfig().get('jwtSecret'), {
              algorithms: ['HS256']
            }, function (err: any, decoded: any) {
              if (err) {
                reject(err);
              } else {
                userRepository.findOne(decoded.id).then(resolve)
              }
            });
          } else {
            resolve(undefined)
          }
        } else {
          resolve(undefined)
        }
      })
      
      for(const scope of scopes ?? []) {
        if(scope === 'user') {
          if(!user || !userService.isGranted(user, ROLE.USER)) {
            return Promise.reject(new ApiException('Not authorized', 401))
          }
        } else if(scope === 'same-user') {
          if(!user || !userService.isGranted(user, ROLE.USER) || !request.params.uid) {
            return Promise.reject(new ApiException('Not authorized', 401))
          }
  
          const isSameUser = request.params.uid === user.uid || request.params.uid === user.username
          if(!isSameUser) {
            return Promise.reject(new ApiException('Not authorized', 401))
          }
        } else if(scope === 'admin') {
          if(!user || !userService.isGranted(user, ROLE.SUPER_ADMIN)) {
            return Promise.reject(new ApiException('Not authorized', 401))
          }
        }
      }

      return user
    }
  }