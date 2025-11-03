const redisClient = require('./redis.client');

class CacheService {
  async get(key) {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttl = 3600) {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  }

  async delete(key) {
    await redisClient.del(key);
  }

  async deletePattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }

  async exists(key) {
    return (await redisClient.exists(key)) === 1;
  }

  async increment(key, value = 1) {
    return redisClient.incrby(key, value);
  }

  async decrement(key, value = 1) {
    return redisClient.decrby(key, value);
  }

  async expire(key, ttl) {
    await redisClient.expire(key, ttl);
  }

  async flush() {
    await redisClient.flushdb();
  }
}

module.exports = new CacheService();
