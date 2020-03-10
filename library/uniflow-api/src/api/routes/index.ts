import { Router } from 'express';
import auth from './auth';
import config from './config';
import contact from './contact';
import folder from './folder';
import program from './program';
import user from './user';
import version from './version';

const router = Router();
auth(router);
config(router);
contact(router);
folder(router);
program(router);
user(router);
version(router);

export default router;
