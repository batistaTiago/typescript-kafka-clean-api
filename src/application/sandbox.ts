import { RedisCache } from "../infra/cache/redis-cache";
(async () => {
    const cacheClient = new RedisCache;
    const key = 'teste_chave_redis';
    const value = { field: 'value' };
    
    await cacheClient.set(key, value)
    console.log(await cacheClient.get(key));
    await cacheClient.forget(key)
    console.log(await cacheClient.get(key));
})()