import express, { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import { indexRouter } from './routes/indexRoute';
import { disconnectDB } from './config/db';
import { NotFoundError } from './errors/httpErrors/notFoundError';
import { errorHandler } from './middlewares/errorHandler';
import { errorhandler } from './middlewares/error';
import { UserDoc } from './models/User';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { authRouter } from './routes/authRoutes';
import { questionRouter } from './routes/questionRoutes';
import { regionRouter } from './routes/regionRoutes';
import { adminRouter } from './routes/adminRoutes';

// use this client to interact with redis
import { client } from './config/redis';
import ErrorResponse from './utils/ErrorResponse';

const RedisStore = connectRedis(session);

const app: Application = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDoc; // change any to fixed document
    }
  }
}
declare module 'express-session' {
  interface Session {
    user: string;
  }
}

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
app.use(questionRouter);
app.use(regionRouter);
app.use(adminRouter);

// error handler
app.use(errorhandler);
// app.use(errorHandler);

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
  return next(new ErrorResponse('Not found', 404));
});

// shutdown cleanup
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
