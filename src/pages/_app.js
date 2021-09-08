/* eslint-disable no-alert, no-console */

import * as types from 'actions/types';
import { getAllWallet, getMe } from 'actions/user';
import initUserSocket from 'actions/userSocket';
import Head from 'components/common/Head';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'public/css/font.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAsync } from 'react-use';
import Tracking from 'src/components/common/Tracking';
import initPublicSocket from 'src/redux/actions/publicSocket';
import { useStore } from 'src/redux/store';
// import * as fpixel from 'src/utils/fpixel';
import 'src/styles/app.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import AuthStorage from 'src/utils/auth-storage';
import * as ga from 'src/utils/ga';

export function reportWebVitals(metric) {
    switch (metric.name) {
        case 'FCP':
            console.log('First Contentful Paint (FCP)', metric);
            break;
        case 'LCP':
            console.log('Largest Contentful Paint (LCP)', metric);
            break;
        case 'CLS':
            console.log('Cumulative Layout Shift (CLS)', metric);
            break;
        case 'FID':
            console.log('First Input Delay (FID)', metric);
            break;
        case 'TTFB':
            console.log('Time to First Byte (TTFB)', metric);
            break;
        default:
            break;
    }
}

const ignoreAuthUrls = [
    '/authenticated',
];

const ignoreConfigUrls = [
    '/authenticated', '/blog', '/blog/[slug]',
];
let lastUserId = null;
let lastToken = null;
let initConfig = false;
const App = ({ Component, pageProps }) => {
    const store = useStore(pageProps.initialReduxState);
    const router = useRouter();

    useEffect(() => {
        router.events.on('routeChangeStart', url => {
            NProgress.start();
        });
        router.events.on('routeChangeComplete', () => NProgress.done());
        router.events.on('routeChangeError', () => NProgress.done());

        const handleRouteChange = (url) => {
            ga.pageview(url);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    // Khởi tạo access token
    useAsync(async () => {
        console.log('__ check get me');
        await store.dispatch(getMe());
        store.dispatch({
            type: types.SET_LOADING_USER,
            payload: false,
        });
    }, []);

    useEffect(() => {
        if (!initConfig && !ignoreConfigUrls.includes(router.pathname)) {
            console.log('Init all configs');
            store.dispatch(initPublicSocket());
            // Get config
            // store.dispatch(getAssetConfig());
            // store.dispatch(getExchangeConfig());
            initConfig = true;
            // Get common data
        }
    }, []);

    // store.subscribe(watch(Store.getState, 'User.user')((newVal, oldVal) => {
    //     authSocialSocket();

    //     // if (newVal) {
    //     //     this.props.getUserBalance();
    //     //     this.props.getUserFuturesBalance();
    //     // }
    // }));

    store.subscribe(() => {
        if (!ignoreAuthUrls.includes(router.pathname)) {
            // Thay đổi access token -> gọi authen
            const newAccessToken = store.getState()?.auth?.accessToken;
            if (!!AuthStorage.accessToken
                && newAccessToken === AuthStorage.accessToken
                && newAccessToken !== lastToken
            ) {
                lastToken = AuthStorage.accessToken;
                store.dispatch(getMe());
            }

            // Thay đổi user -> khởi tạo function
            const newUserId = store.getState()?.auth?.user?.id;
            if (!!newUserId && newUserId !== lastUserId) {
                if (AuthStorage.loggedIn) {
                    lastUserId = newUserId;
                    store.dispatch(initUserSocket());
                    store.dispatch(getAllWallet());
                }
            }
        }
    });

    return (
        <>
            <Head />
            <Provider store={store}>
                <Tracking>
                    <Component {...pageProps} />
                </Tracking>
            </Provider>
        </>

    );
};

export default appWithTranslation(App);
