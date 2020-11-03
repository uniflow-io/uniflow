import * as convict from 'convict';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// typescript sample code : https://github.com/bright/brightwallet/blob/master/backend/src/database/database.config.ts

interface DatabaseConfig {
  type: 'sqlite' | 'mongodb' | 'mysql' |'postgres'
  sqlite: {
    database: string
  },
  mongodb: {
    connectionUrl: string
  },
  mysql: {
    database: string,
    host: string,
    user: string,
    password: string,
    port: number,
  },
  postgres: {
    database: string,
    host: string,
    user: string,
    password: string,
    port: number,
  },
}

export type AppConfig = {
  database: DatabaseConfig,
  port: number,
  corsAllowOrigin: string,
  jwtSecret: string,
  facebookAppId: string,
  githubAppId: string,
  githubAppSecret: string,
  mailerUrl: string,
};

export default (env: string): convict.Config<AppConfig> => {
  const envConfig = dotenv.parse(fs.readFileSync(`.env.${env}`))
  if (!envConfig) {
    // Throw generic error
    throw new Error(`Couldn't find .env.${env} file`);
  }
  
  const config = convict<AppConfig>({
    database: {
      type: {
        doc: 'Type of database to use',
        format: ['sqlite', 'mongodb', 'mysql', 'postgres'],
        default: 'sqlite',
        env: 'DB_TYPE'
      },
      sqlite: {
        database: {
          doc: 'sqlite Database',
          format: String,
          default: './database.sqlite',
          env: 'DB_SQLITE_DATABASE'
        }
      },
      mongodb: {
        connectionUrl: {
          doc: 'MongoDB Connection URL',
          format: '*',
          default: 'mongodb://user:password@localhost:27017/database',
          env: 'DB_MONGODB_CONNECTION_URL'
        }
      },
      mysql: {
        database: {
          doc: 'MySQL Database',
          format: String,
          default: 'uniflow',
          env: 'DB_MYSQL_DATABASE'
        },
        host: {
          doc: 'MySQL Host',
          format: String,
          default: '127.0.0.1',
          env: 'DB_MYSQL_HOST'
        },
        user: {
          doc: 'MySQL User',
          format: String,
          default: 'root',
          env: 'DB_MYSQL_USER'
        },
        password: {
          doc: 'MySQL Password',
          format: String,
          default: '',
          env: 'DB_MYSQL_PASSWORD'
        },
        port: {
          doc: 'MySQL Port',
          format: Number,
          default: 3306,
          env: 'DB_MYSQL_PORT'
        },
      },
      postgres: {
        database: {
          doc: 'PostgresDB Database',
          format: String,
          default: 'uniflow',
          env: 'DB_POSTGRES_DATABASE'
        },
        host: {
          doc: 'PostgresDB Host',
          format: String,
          default: 'localhost',
          env: 'DB_POSTGRES_HOST'
        },
        user: {
          doc: 'PostgresDB User',
          format: String,
          default: 'root',
          env: 'DB_POSTGRES_USER'
        },
        password: {
          doc: 'PostgresDB Password',
          format: String,
          default: '',
          env: 'DB_POSTGRES_PASSWORD'
        },
        port: {
          doc: 'PostgresDB Port',
          format: Number,
          default: 5432,
          env: 'DB_POSTGRES_PORT'
        },
      },
    },
    port: {
      format: Number,
      default: 8017,
      arg: 'port',
      env: 'PORT',
      doc: 'HTTP port uniflow api can be reached'
    },
    corsAllowOrigin: {
      format: String,
      default: '*',
      env: 'CORS_ALLOW_ORIGIN',
      doc: 'CORS allow origin'
    },
    jwtSecret: {
      format: String,
      default: 'uniflow',
      env: 'JWT_SECRET',
      doc: 'JWT secret'
    },
    facebookAppId: {
      format: String,
      default: '',
      env: 'FACEBOOK_APP_ID',
      doc: 'Facebook App Id'
    },
    githubAppId: {
      format: String,
      default: '',
      env: 'GITHUB_APP_ID',
      doc: 'Github App Id'
    },
    githubAppSecret: {
      format: String,
      default: '',
      env: 'GITHUB_APP_SECRET',
      doc: 'Github App Secret'
    },
    mailerUrl: {
      format: String,
      default: '',
      env: 'MAILER_URL',
      doc: 'Mailer Url'
    },
  }, {
    env: envConfig
  });
  
  config.validate({
    allowed: 'strict',
  });

  return config
}
