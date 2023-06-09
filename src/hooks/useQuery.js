import { set } from 'lodash';
import ms from 'ms';
import { useCallback, useEffect, useState } from 'react';
import { isBrowser } from 'redux/actions/utils';

const prefix = 'nami_query';

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
 * @param {?{cache: boolean, ttl: string, storage: BaseStorage}} options ttl is currently using ms see: https://github.com/vercel/ms
 * @returns {{data: T | undefined, isLoading: boolean, reFetch: Function, stale}}
 */
const useQuery = (queryKey = [''], fetch, options = { cache: false, ttl: '1d', storage: asyncLocalStorage }) => {
    const { cache = false, ttl = '1d', storage = asyncLocalStorage } = options;
    const key = JSON.stringify(queryKey);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();

    const stale = () => storage.clear(key);
    const reFetch = useCallback(
        async (signal) => {
            setIsLoading(true);
            try {
                const data = await fetch({ queryKey, signal });
                setData(data);
                if (cache) {
                    storage.set(
                        key,
                        JSON.stringify({
                            expiry: Date.now() + ms(ttl),
                            data
                        })
                    );
                }
            } catch (error) {
                console.log({ error: error.message });
            } finally {
                setIsLoading(false);
            }
        },
        [fetch, cache, storage]
    );

    const getData = async (abortSignal) => {
        setIsLoading(true);
        if (cache) {
            try {
                const stringCache = await storage.get(key);
                const res = JSON.parse(stringCache);
                setData(res.data);
                if (Date.now() > res.expiry) {
                    reFetch(abortSignal);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                return reFetch(abortSignal);
            }
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
