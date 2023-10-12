import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLoginUrl } from 'redux/actions/utils';
import { useRouter } from 'next/router';
import fetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_CREATE_INVITE } from 'redux/actions/apis';

export default function() {
    const user = useSelector(state => state.auth.user) || null;
    const loadingUser = useSelector(state => state.auth.loadingUser);
    const router = useRouter();
    const { query } = router;

    useEffect(() => {
        if (!loadingUser && !user) {
            window.location.href = getLoginUrl('sso', 'register', {
                referral: query.code,
                utm_medium: 'referral'
            });
        } else {
           setInvite()
        }
    }, [user, loadingUser]);

    // TODO: ...
    const setInvite = async () => {
        const response = await fetchApi({
            url: API_NEW_REFERRAL_CREATE_INVITE,
            options: {
                method: 'POST'
            },
            params: { code: query.code }
        });
        // TODO: handle error here
        await router.push('/');
    };

    return null;
}
