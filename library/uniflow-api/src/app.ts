import 'reflect-metadata';
import * as express from 'express';
import config from './config';
import {database, server} from './loaders';

export default async function main(): Promise<express.Application> {
  const PORT = config.get('port');

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
      console.log(`Uniflow api ready on port: ${PORT}`);

      resolve(app)
    });
  }))
}
