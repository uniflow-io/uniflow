import * as jwt from 'express-jwt';
import config from '../../config';
import {Request} from "express";

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

export default jwt({
  secret: config.get('jwtSecret'), // The _secret_ to sign the JWTs
  userProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request
  credentialsRequired: false,
  algorithms: ['HS256'],
});
