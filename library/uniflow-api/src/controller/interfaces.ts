import { Router } from 'express';

export interface ControllerInterface {
  routes(app: Router): Router;
}
