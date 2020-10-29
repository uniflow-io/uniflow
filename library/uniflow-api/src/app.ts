import 'reflect-metadata';
import * as express from 'express';
import { env } from './config';
import { database, server } from './loaders';

export default async function app(): Promise<express.Application> {
  const PORT = env.get('port');

  await database();
  
  const app = express();
  await server(app, express.static('./public'));

  return new Promise<express.Application>((resolve => {
    app.listen(PORT, (err: any) => {
      if (err) {
        console.log(err);
        process.exit(1);
        return;
      }

      resolve(app)
    });
  }))
}
