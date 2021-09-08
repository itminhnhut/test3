import { SET_ACCESS_TOKEN } from 'actions/types';
import { setUser } from 'actions/user';
import { useRouter } from 'next/router';
import { generate } from 'randomstring';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import AuthStorage from 'src/utils/auth-storage';
import fetchAPI from 'src/utils/fetch-api';

const Authenticated = ({ token }) => {
    const router = useRouter();
    AuthStorage.value = token;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: SET_ACCESS_TOKEN,
            payload: token.accessToken,
        });
        router.push('/onboarding', undefined, { shallow: true });
    }, []);
    return null;
};

export async function getServerSideProps(context) {
    const clientId = generate(32);
    const res = await fetchAPI({
        url: '/api/v1/web/token',
        options: {
            method: 'POST',
        },
        params: {
            ...context?.query,
            clientId,
        },

    });
    const { data: token } = res;
    return { props: { token: { ...token, clientId } } };
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = { setUser };

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);
//
// export default Authenticated;
