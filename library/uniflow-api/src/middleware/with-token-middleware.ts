import * as jwt from 'express-jwt';
import { MiddlewareInterface } from './interfaces';
import { Service } from 'typedi';
import { ParamsConfig } from '../config';

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 */
const getTokenFromHeader = (req: any) => {
  if (req.headers['uniflow-authorization'] && req.headers['uniflow-authorization'].split(' ')[0] === 'Bearer') {
    return req.headers['uniflow-authorization'].split(' ')[1];
  }

  return null;
};

@Service()
export default class WithTokenMiddleware implements MiddlewareInterface {
  constructor(
    private params: ParamsConfig
  ) {}

  middleware(): any {
    return jwt({
      secret: this.params.getConfig().get('jwtSecret'), // The _secret_ to sign the JWTs
      userProperty: 'token', // Use req.token to store the JWT
      getToken: getTokenFromHeader, // How to extract the JWT from the request
      credentialsRequired: false,
      algorithms: ['HS256'],
    })
  }
}
