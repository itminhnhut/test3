import axios from 'axios';
import { useEffect, useState } from 'react';
import FetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
const useFetchApi = ({ url = '', params, successCallBack = () => {} }, condition = true, dependencies = [], isNotFetch = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const source = axios.CancelToken.source();
        let mounted = false;

        if (isNotFetch) return setData(null);
        if (condition) {
            (async () => {
                try {
                    setLoading(true);
                    const data = await FetchApi({ url, cancelToken: source.token, params });
                    if (data && (data?.status === ApiStatus.SUCCESS || data?.message === ApiStatus.SUCCESS)) {
                        setData(data.data);
                    } else {
                        setData(null);
                    }
                    successCallBack(data);
                } catch (error) {
                    setError(error);
                } finally {
                    if (mounted) {
                        setLoading(true);
                    } else setLoading(false);
                }
            })();
        }
        return () => {
            mounted = true;
            source.cancel();
        };
    }, dependencies);

    return { data, loading, error };
};

export default useFetchApi;
