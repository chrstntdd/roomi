import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import graphql from 'express-graphql';
import cors from 'cors';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { join } from 'path';

import resolvers from './graphql/resolvers';

require('dotenv').config();

const app = express();

/* Set mongoose promise to native ES6 promise */
(<any>mongoose).Promise = Promise;

const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';
let DATABASE_URL;
let PORT;

/* set environment variables */
if (IS_PRODUCTION) {
  DATABASE_URL = process.env.MONGODB_URI;
  PORT = parseInt(process.env.PORT, 10);
} else {
  DATABASE_URL = process.env.TEST_DATABASE_URL;
  PORT = 3000;
}

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4444');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/ping', (_, res) => {
  res.status(200).send('pong');
});

const typeDefs = importSchema(join(__dirname, 'graphql/schema.graphql'));
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  '/graphql',
  cors({
    origin: 'http://localhost:4444'
  }),
  graphql((request, response, graphQlParams) => {
    return {
      schema,
      pretty: true,
      graphiql: !IS_PRODUCTION,
      context: {
        token: ''
      }
    };
  })
);

let server;

const runServer = async (dbURL: string = DATABASE_URL, port: number = PORT) => {
  try {
    await mongoose.connect(
      dbURL,
      { useNewUrlParser: true }
    );
    await new Promise((resolve, reject) => {
      server = app
        .listen(port, () => {
          console.info(`The ${ENV} server is listening on port ${port} 🤔`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  } catch (err) {
    console.error(err);
  }
};

const closeServer = async () => {
  try {
    await mongoose.disconnect();
    await new Promise((resolve, reject) => {
      console.info(`Closing server. Goodbye old friend.`);
      server.close(err => (err ? reject(err) : resolve()));
    });
  } catch (err) {
    console.error(err);
  }
};

require.main === module && runServer().catch(err => console.error(err));

export { runServer, closeServer, app };
