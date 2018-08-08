import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import graphql from 'express-graphql';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { join } from 'path';

import { DATABASE_URL, ENV, PORT } from './config';
import resolvers from './graphql/resolvers';

require('dotenv').config();

const app = express();

/* Set mongoose promise to native ES6 promise */
(<any>mongoose).Promise = Promise;

const connectOptions = {
  useMongoClient: true,
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
};

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/ping', (_, res) => {
  res.status(200).send('pong');
});

const typeDefs = importSchema(join(__dirname, 'graphql/schema.graphql'));
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  '/graphql',
  graphql({
    schema,
    graphiql: true
  })
);

let server;

const runServer = async (dbURL: string = DATABASE_URL, port: number = PORT) => {
  try {
    // await mongoose.connect(
    //   dbURL,
    //   connectOptions
    // );
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
