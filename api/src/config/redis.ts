import redis from 'redis';

// initialised redis client
const client = redis.createClient({
  host: 'redis',
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
