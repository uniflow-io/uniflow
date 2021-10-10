import express from 'express';
import { appConfig } from './config';

export default async function server() {
  const port = appConfig.get('port');

  const app = express();
  app.use('/', express.static('./public'));

  return new Promise((resolve: any) => {
    app.on('error', (err: any) => {
      console.log(err);
      process.exit(1);
    });
    app.listen(port, resolve);
  });
}
