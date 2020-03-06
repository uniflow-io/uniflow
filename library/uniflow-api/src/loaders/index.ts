import * as express from 'express';
import 'reflect-metadata';
import database from './database';
import server from './server';

export default async (app: express.Application) => {
  await database();
  await server(app);
};
