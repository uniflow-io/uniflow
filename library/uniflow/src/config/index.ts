import * as convict from 'convict';
import * as dotenv from 'dotenv';

const activeEnv = process.env.NODE_ENV || 'development';

const envFound = dotenv.config({
  path: `.env.${activeEnv}`,
});
if (!envFound) {
  // Throw generic error
  throw new Error(`Couldn't find .env.${activeEnv} file`);
}

const config = convict({
  database: {
    type: {
      doc: 'Type of database to use',
      format: ['sqlite', 'mongodb', 'mysqldb', 'postgresdb'],
      default: 'sqlite',
      env: 'DB_TYPE'
    },
    sqlite: {
      database: {
        doc: 'sqlite Database',
        format: String,
        default: './database.sqlite',
        env: 'DB_POSTGRESDB_DATABASE'
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
    mysqldb: {
      database: {
        doc: 'MySQL Database',
        format: String,
        default: 'uniflow',
        env: 'DB_MYSQLDB_DATABASE'
      },
      host: {
        doc: 'MySQL Host',
        format: String,
        default: '127.0.0.1',
        env: 'DB_MYSQLDB_HOST'
      },
      password: {
        doc: 'MySQL Password',
        format: String,
        default: '',
        env: 'DB_MYSQLDB_PASSWORD'
      },
      port: {
        doc: 'MySQL Port',
        format: Number,
        default: 3306,
        env: 'DB_MYSQLDB_PORT'
      },
      user: {
        doc: 'MySQL User',
        format: String,
        default: 'root',
        env: 'DB_MYSQLDB_USER'
      },
    },
    postgresdb: {
      database: {
        doc: 'PostgresDB Database',
        format: String,
        default: 'uniflow',
        env: 'DB_POSTGRESDB_DATABASE'
      },
      host: {
        doc: 'PostgresDB Host',
        format: String,
        default: 'localhost',
        env: 'DB_POSTGRESDB_HOST'
      },
      password: {
        doc: 'PostgresDB Password',
        format: String,
        default: '',
        env: 'DB_POSTGRESDB_PASSWORD'
      },
      port: {
        doc: 'PostgresDB Port',
        format: Number,
        default: 5432,
        env: 'DB_POSTGRESDB_PORT'
      },
      user: {
        doc: 'PostgresDB User',
        format: String,
        default: 'root',
        env: 'DB_POSTGRESDB_USER'
      },
    },
  },
  port: {
    format: Number,
    default: 8090,
    arg: 'port',
    env: 'PORT',
    doc: 'HTTP port uniflow can be reached'
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
});

config.validate({
  allowed: 'strict',
});

export default config
