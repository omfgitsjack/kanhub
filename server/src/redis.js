
import bluebird from 'bluebird';
import redis from 'redis';
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default function redisFactory() {
    let redisClient = redis.createClient({
        port: 6379,
        host: process.env.REDIS_HOST
    });

    return redisClient;
}