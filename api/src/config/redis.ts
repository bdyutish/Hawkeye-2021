import redis from 'redis';

if (!process.env.REDIS_HOST) {
  console.log('redis host not found in the env variables');
  process.exit(0);
}

// initialised redis client
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
});
client.on('connect', () => {
  console.log('Connected to redis client');
});

client.on('error', () => {
  console.log('Error connecting to redis');
});

client.on('ready', () => {
  console.log('Redis is ready...');
});

export { client };
