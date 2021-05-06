import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { indexRouter } from './routes/indexRoute';
import { disconnectDB } from './config/db';

// use this client to interact with redis
import { client } from './config/redis';

const app: Application = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// link routers here
app.use(indexRouter);

// handling unknown routes
app.all('*', async (req: Request, res: Response) => {
  return res.status(404).send({
    err: 'route not found',
  });
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
