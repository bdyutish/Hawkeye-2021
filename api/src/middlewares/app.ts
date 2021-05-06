import express, { Request, Response, Application } from 'express';
import { indexRouter } from './routes/indexRoute';
import { authRouter } from './routes/authRoute';
import { NotFoundError } from './errors/httpErrors/notFoundError';
import { errorHandler } from './middlewares/errorHandler';
import { errorhandler } from './middlewares/error';
import { UserDoc } from './models/User';
import session from 'express-session';
import connectRedis from 'connect-redis';
import morgan from 'morgan';
import redis from 'redis';
import cors from 'cors';
import 'express-async-errors';
import { designRouter } from './routes/designRoute';
import { commentRouter } from './routes/commentRoute';
import { compRouter } from './routes/compRoute';
import { adminRouter } from './routes/adminRoute';
import cron from 'node-cron';
import {
  endCompetition,
  startCompetiton,
} from '../src/controllers/compController';
import { disconnectDB } from './config/db';

const RedisStore = connectRedis(session);

// creating redis client
const client = redis.createClient();

// Redis error conn checks
client.on('connect', () => {
  console.log('connected to redis');
});
client.on('error', function (err) {
  console.log('redis is not running');
  console.log(err);
});
client.on('ready', function () {
  console.log('redis is running');
});

const app: Application = express();

cron.schedule('0 * * * *', async function () {
  await startCompetiton();
  await endCompetition();
});

app.use(express.json());
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDoc; // change any to fixed document
    }
  }
}

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://10.68.0.96:3000'],
    credentials: true,
  })
);

app.use(morgan('tiny'));
// creating session and cookie
app.use(
  session({
    secret: 'secret',
    store: new RedisStore({
      client: client,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }, // (change accordingly)
  })
);

// link routers here
app.use(indexRouter);
app.use(authRouter);
app.use(designRouter);
app.use(commentRouter);
app.use(compRouter);
app.use(adminRouter);

// any route except the mentioned ones

app.use(errorhandler); //remove after changing errors

app.all('*', async (req: Request, res: Response, next) => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

const cleanup = async () => {
  await disconnectDB();
  if (client.quit()) {
    console.log('Redis disconnected');
  } else {
    console.log('Err disconnecting Redis');
  }

  console.log('Shutting down server...');
  process.exit(0);
};

// Handling terminating signals
process.on('SIGINT', cleanup);
process.on('SIGABRT', cleanup);

export { app };
