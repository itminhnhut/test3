/* eslint-disable no-alert, no-console */

import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import { useStore } from 'src/redux/store';
import 'public/css/font.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import AuthStorage from 'src/utils/auth-storage';
import initPublicSocket from 'src/redux/actions/publicSocket';
import { useEffect } from 'react';
import Head from 'components/common/Head';
import { getAllWallet, getMe, setQuoteAsset } from 'actions/user';
import { getAssetConfig, getExchangeConfig } from 'actions/market';
import initUserSocket from 'actions/userSocket';
import * as types from 'actions/types';

import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import * as ga from 'src/utils/ga';
// import * as fpixel from 'src/utils/fpixel';
import 'src/styles/app.scss';
import Tracking from 'src/components/common/Tracking';

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
        if (AuthStorage.accessToken) {
            await store.dispatch(getMe());
            lastToken = AuthStorage.accessToken;
            store.dispatch({
                type: types.SET_ACCESS_TOKEN,
                payload: AuthStorage.accessToken,
            });
        }
        store.dispatch({
            type: types.SET_LOADING_USER,
            payload: false,
        });
    }, []);

    useEffect(() => {
        if (!initConfig && !ignoreConfigUrls.includes(router.pathname)) {
            console.log('Init all configs');
            // Init asset config
            const lsQuoteAsset = localStorage.getItem('wallet:quote_asset');
            store.dispatch(setQuoteAsset(['USDT', 'VNDC'].includes(lsQuoteAsset) ? lsQuoteAsset : 'USDT'));

            store.dispatch(initPublicSocket());
            // Get config
            store.dispatch(getAssetConfig());
            store.dispatch(getExchangeConfig());
            initConfig = true;
            // Get common data
        }
    }, []);

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
