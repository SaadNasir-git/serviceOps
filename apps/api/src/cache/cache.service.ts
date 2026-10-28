import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CacheRegistry } from './types.js';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    async get<K extends keyof CacheRegistry>(key: `${K}:${string}`): Promise<CacheRegistry[K] | undefined> {
        const raw = this.cacheManager.get<CacheRegistry[K]>(key);
        return this.deserialize<CacheRegistry[K]>(raw);
    }

    async set<K extends keyof CacheRegistry>(key: `${K}:${string}`, value: CacheRegistry[K], ttl?: number): Promise<void> {
        await this.cacheManager.set(key, JSON.stringify(value), ttl);
    }

    async getdel<K extends keyof CacheRegistry>(key: `${K}:${string}`): Promise<CacheRegistry[K] | undefined> {
        const raw = await this.cacheManager.get<CacheRegistry[K]>(key);
        await this.cacheManager.del(key);
        return this.deserialize<CacheRegistry[K]>(raw);
    }

    async del<K extends keyof CacheRegistry>(key: `${K}:${string}` | `${K}:${string}`[]) {
        if (typeof key === 'string') {
            await this.cacheManager.del(key)
        } else {
            await this.cacheManager.mdel(key)
        }
    }

    private deserialize<T>(raw: unknown): T | undefined {
        if (raw === undefined || raw === null) return undefined;

        if (typeof raw !== 'string') return raw as T;

        try {
            return JSON.parse(raw) as T;
        } catch {
            return raw as T;
        }
    }

}