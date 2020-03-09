import 'reflect-metadata';
import * as express from 'express';
import {
  dirname as pathDirname,
  join as pathJoin,
} from 'path';
import config from './config';
import {database, server} from '@uniflow-io/uniflow-api/src/loaders';

export default async function app(): Promise<express.Application> {
  const PORT = config.get('port');

  await database();

  const app = express();
  await server(app, express.static(pathJoin(pathDirname(
    require.resolve('@uniflow-io/uniflow-client')
  ), '../public')));

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
