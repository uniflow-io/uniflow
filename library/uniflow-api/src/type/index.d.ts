import { Router } from 'express';
import { UserEntity } from '../entity';

declare global {
  namespace Express {
    export interface Request {
      user: UserEntity
      token: any
    }
  }
}

export interface MiddlewareInterface {
  middleware(): any;
}

export interface ControllerInterface {
  routes(app: Router): Router;
}

export interface LoaderInterface {
  load(): Promise<void>;
}

export interface FixtureInterface {
  load(): Promise<void>;
}

export interface ExceptionInterface {
  name: string;
  message: string;
  code: string;
  status: number;
}
