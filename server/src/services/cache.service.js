const NodeCache = require('node-cache');
const { logger } = require('../utils/logger');

class CacheService {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
        this.stats = {
            hits: 0,
            misses: 0,
        };
    }

    get(key) {
        const value = this.cache.get(key);
        if (value) {
            this.stats.hits++;
            logger.debug({ key }, 'Cache HIT');
            return value;
        }
        this.stats.misses++;
        logger.debug({ key }, 'Cache MISS');
        return null;
    }

    set(key, value, ttl) {
        return this.cache.set(key, value, ttl);
    }

    del(key) {
        return this.cache.del(key);
    }

    delMany(keys) {
        return this.cache.del(keys);
    }

    flush() {
        return this.cache.flushAll();
    }

    has(key) {
        return this.cache.has(key);
    }

    keys() {
        return this.cache.keys();
    }

    getStats() {
        return {
            ...this.cache.getStats(),
            ...this.stats,
        };
    }

    invalidatePattern(pattern) {
        const keys = this.cache.keys();
        const keysToDelete = keys.filter((key) => key.includes(pattern));
        this.cache.del(keysToDelete);
        logger.info({ pattern, count: keysToDelete.length }, 'Invalidated cache pattern');
    }

    async getOrSet(key, fetchFn, ttl) {
        const cached = this.get(key);
        if (cached) {
            return cached;
        }

        const result = await fetchFn();
        this.set(key, result, ttl);
        return result;
    }

    wrap(fn, ttl) {
        return async (...args) => {
            const key = `${fn.name}:${JSON.stringify(args)}`;
            return this.getOrSet(key, () => fn(...args), ttl);
        };
    }
}

module.exports = new CacheService();
