import * as express from 'express';
import config from './config';
import loaders from './loaders';

async function main() {
  const PORT = config.get('port');
  const app = express.default();
  await loaders(app);

  app.listen(PORT, (err: any) => {
    if (err) {
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`Uniflow api ready on port: ${PORT}`);
  });
}

main();
