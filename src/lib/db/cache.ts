const cache = new Map();
const CACHE_STATS = {
  hits: 0,
  misses: 0,
  total: 0,
};

// 清除指定缓存
export function invalidateCache(queryName: string): void {
  cache.delete(queryName);
  console.log(`[Cache] 已清除缓存: ${queryName}`);
}

// 清除所有缓存
export async function invalidateAllCache(): Promise<void> {
  cache.clear();
  console.log("[Cache] 已清除所有缓存");
}

// Add cache persistence check
function shouldRefreshCache(
  cachedData: CacheEntry<any>,
  options: CacheOptions
): boolean {
  if (!cachedData) return true;

  const { timestamp } = cachedData;
  const age = (Date.now() - timestamp) / 1000;
  const isExpired = age > options.ttl;

  // Refresh cache if it's more than 80% through its TTL
  const shouldRefreshEarly = age > options.ttl * 0.8;

  return isExpired || shouldRefreshEarly;
}

interface CacheOptions {
  ttl: number; // 缓存时间（秒）
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  size?: number;
}

export async function cachedPrismaQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  options: CacheOptions = { ttl: 3600 }
): Promise<T> {
  const cacheKey = queryName;
  const cachedData = cache.get(cacheKey) as CacheEntry<T> | undefined;
  CACHE_STATS.total++;

  console.log("--------------------------------");
  console.log(`[Cache] 请求查询: ${queryName}`);
  console.log(
    `[Cache] 当前缓存统计 - 总请求数: ${CACHE_STATS.total}, 命中数: ${CACHE_STATS.hits}, 未命中数: ${CACHE_STATS.misses}`
  );

  if (cachedData) {
    const { data, timestamp } = cachedData;
    const age = (Date.now() - timestamp) / 1000;
    const isExpired = shouldRefreshCache(cachedData, options);

    console.log(`[Cache] 找到缓存数据`);
    console.log(`[Cache] 缓存年龄: ${age.toFixed(1)}秒`);
    console.log(`[Cache] TTL设置: ${options.ttl.toFixed(1)}秒`);

    if (isExpired) {
      console.log(`[Cache] 缓存已过期 ❌ `);
      // 在后台刷新缓存
      queryFn()
        .then((newData) => {
          cache.set(cacheKey, {
            data: newData,
            timestamp: Date.now(),
            size: JSON.stringify(newData).length,
          });
          console.log(`[Cache] 后台刷新缓存完成`);
        })
        .catch((error) => {
          console.error(`[Cache] 后台刷新缓存失败:`, error);
        });

      // 返回过期的数据
      CACHE_STATS.hits++;
      console.log(`[Cache] 返回过期数据，后台刷新中...`);
      return data;
    } else {
      CACHE_STATS.hits++;
      console.log(`[Cache] 缓存命中 ✅`);
      return data;
    }
  } else {
    console.log(`[Cache] 未找到缓存数据 ❌`);
  }

  CACHE_STATS.misses++;
  const data = await queryFn();
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    size: JSON.stringify(data).length,
  });

  // Implement LRU-like cleanup if cache gets too large
  if (cache.size > 1000) {
    const entries = Array.from(cache.entries());
    const oldestEntries = entries
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .slice(0, Math.floor(entries.length * 0.2)); // Remove oldest 20%

    for (const [key] of oldestEntries) {
      cache.delete(key);
    }
  }

  return data;
}
