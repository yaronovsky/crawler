import Redis from "ioredis";

const redis : Redis | null = null;

const getRedisClient = () => {
    if (redis === null) {

        return new Redis({host: process.env.REDIS_HOST});
    }
    return redis;
};

export default getRedisClient;
