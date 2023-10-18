import { set } from 'lodash';
import ms from 'ms';
import { useCallback, useEffect, useState } from 'react';
import { isBrowser } from 'redux/actions/utils';

const cacheMap = {};

// todo: using store to make it global instead of cacheMap
export class BaseStorage {
    async set(key = '', value = '') {}
    async get(key = '') {
        return '';
    }
    async clear(key = '') {}
    async clearAll() {}
}

class AsyncLocalStorage extends BaseStorage {
    async set(key = '', value = '') {
        return isBrowser() && localStorage.setItem(key, value);
    }

    async get(key = '') {
        return isBrowser() ? localStorage.getItem(key) : null;
    }

    async clear(key = '') {
        return isBrowser() && localStorage.removeItem(key);
    }

    async clearAll() {
        return isBrowser() && localStorage.clear();
    }
}

export const asyncLocalStorage = new AsyncLocalStorage();
/**
 *
 * @param {unknown[]} queryKey
 * @param {(context: {queryKey: unknown[], signal?: AbortSignal}) => T | Promise<T>} fetch
 * @param {?{persist: boolean, ttl: string, storage: BaseStorage, cache: Boolean}} options ttl is currently using ms see: https://github.com/vercel/ms
 * @returns {{data: T | undefined, isLoading: boolean, reFetch: Function, stale}}
 */
const useQuery = (queryKey = [''], fetch, options = { persist: false, ttl: '1d', storage: asyncLocalStorage, cache: true, }) => {
    const { persist = false, ttl = '1d', storage = asyncLocalStorage, cache = true } = options;
    const key = JSON.stringify(queryKey);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();

    const stale = () => {
        cacheMap[key] = undefined;
        storage.clear(key);
    };
    const reFetch = useCallback(
        async (signal) => {
            setIsLoading(true);
            try {
                const data = await fetch({ queryKey, signal });
                setData(data);
                if (cache) {
                    const toCache = {
                        expiry: Date.now() + ms(ttl),
                        data
                    };
                    cacheMap[key] = toCache;
                }

                if (persist) {
                    storage.set(key, JSON.stringify(toCache));
                }
            } catch (error) {
                console.log({ error: error.message });
            } finally {
                setIsLoading(false);
            }
        },
        [fetch, persist, storage]
    );

    const getData = async (abortSignal) => {
        setIsLoading(true);
        let cached = cache ? cacheMap[key] : null;
        if (persist) {
            try {
                if (!cached) {
                    const stringCache = await storage.get(key);
                    cached = JSON.parse(stringCache);
                }
            } catch (error) {
                console.error("Load data from storage failed:", error.message);
            }
        }
        if (cached?.data) {
            setData(cached.data);
        }
        if (Date.now() < cached?.expiry) {
            setIsLoading(false);
        } else {
            reFetch(abortSignal);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getData(controller.signal);
        return () => controller.abort();
    }, [key]);

    return {
        data,
        isLoading,
        reFetch,
        stale
    };
};

export default useQuery;
