import { useRouter } from 'next/router';
import { useEffect } from 'react';
import authStorage from 'utils/auth-storage';
import FetchApi from 'utils/fetch-api';

const LoginFromApp = () => {
    const { query } = useRouter();
    // const dispatch = useDispatch();
    const router = useRouter();

    const fetchAccessToken = async (code) => {
        const result = await FetchApi({
            url: '/api/v1/auto_login/request_access_token',
            options: {
                method: 'GET',
            },
            params: {
                code,
            },
        });
        if (result?.status === 'success') {
            const accessToken = result?.data?.tokens;
            const clientId = result?.data?.clientId;
            const { url } = result?.data?.data;
            const newAccessToken = {
                clientId,
                ...accessToken,
            };
            authStorage.value = newAccessToken;
            return router.push(url, undefined, { shallow: true });
        }
        return null;
    };

    useEffect(() => {
        if (typeof query?.code === 'string' && query?.code?.length > 0) {
            fetchAccessToken(query?.code);
        }
    }, [query]);

    return (
        <div />
    );
};

export default LoginFromApp;

// attlas.io/login_from_app?code=123abc
