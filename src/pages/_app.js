/* eslint-disable no-alert, no-console */

import { appWithTranslation, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'public/css/font.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAsync } from 'react-use';
import {
    getFuturesConfigs,
    getFuturesFavoritePairs,
    getFuturesMarketWatch,
    getFuturesUserSettings,
} from 'redux/actions/futures';
import { getAssetConfig, getExchangeConfig, getUsdRate, } from 'redux/actions/market';
import { getPaymentConfigs } from 'redux/actions/payment';
import { SET_LOADING_USER, SET_USD_RATE } from 'redux/actions/types';
import { getWallet, setTheme } from 'redux/actions/user';
import Head from 'src/components/common/Head';
import Tracking from 'src/components/common/Tracking';
import initPublicSocket from 'src/redux/actions/publicSocket';
import { getMe, getUserFuturesBalance, getVip } from 'src/redux/actions/user';
import initUserSocket from 'src/redux/actions/userSocket';
import { useStore } from 'src/redux/store';
// import * as fpixel from 'src/utils/fpixel';
import 'src/styles/app.scss';
import * as ga from 'src/utils/ga';
import { indexingArticles } from 'utils';

// export function reportWebVitals(metric) {
//     switch (metric.name) {
//         case 'FCP':
//             console.log('First Contentful Paint (FCP)', metric);
//             break;
//         case 'LCP':
//             console.log('Largest Contentful Paint (LCP)', metric);
//             break;
//         case 'CLS':
//             console.log('Cumulative Layout Shift (CLS)', metric);
//             break;
//         case 'FID':
//             console.log('First Input Delay (FID)', metric);
//             break;
//         case 'TTFB':
//             console.log('Time to First Byte (TTFB)', metric);
//             break;
//         default:
//             break;
//     }
// }

const ignoreAuthUrls = ['/authenticated'];

const ignoreConfigUrls = [
    '/authenticated',
    '/support',
    '/blog/[slug]',
    '/404',
    '/500',
    '/authenticated_tfa',
    '/authenticated_tfa/[service]',
    '/maldives',
    '/privacy',
    '/support',
    '/support/announcement',
    '/support/announcement/[topic]',
    '/support/announcement/[topic]/[articles]',
    '/support/faq',
    '/support/faq/[topic]',
    '/support/faq/[topic]/[articles]',
    '/support/search',
    '/terms-of-service',
];
let lastUserId = null;
const lastToken = null;
let initConfig = false;
const App = ({
    Component,
    pageProps
}) => {
    const store = useStore(pageProps.initialReduxState);
    const router = useRouter();
    const {
        i18n: { language },
    } = useTranslation();

    useEffect(() => {
        router.events.on('routeChangeStart', (url) => {
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
        await store.dispatch(getMe());
        await store.dispatch(getVip());
        store.dispatch({
            type: SET_LOADING_USER,
            payload: false,
        });


    }, []);

    useEffect(async() => {
        if (!initConfig && !ignoreConfigUrls.includes(router.pathname)) {
            console.log('Init all configs');
            store.dispatch(initPublicSocket());
            // Get config
            store.dispatch(getAssetConfig());
            store.dispatch(getExchangeConfig());
            store.dispatch(getFuturesConfigs());

            store.dispatch(getPaymentConfigs());

            // store.dispatch(getFuturesFavoritePairs());
            // store.dispatch(getFuturesMarketWatch());
            // store.dispatch(getFuturesUserSettings());
            initConfig = true;
            store.dispatch({
                type: SET_USD_RATE,
                payload: await getUsdRate(),
            });
            // Get common data
            // Init theme
            store.dispatch(setTheme());

            //
        }
    }, []);

    useEffect(() => {
        indexingArticles(language);
    }, [language]);

    store.subscribe(() => {
        if (!ignoreAuthUrls.includes(router.pathname)) {
            const newUserId = store.getState()?.auth?.user?.code;
            // console.log('__ chekc new user', newUserId);
            if (!!newUserId && newUserId !== lastUserId) {
                lastUserId = newUserId;
                store.dispatch(initUserSocket());
                store.dispatch(getWallet());
                store.dispatch(getUserFuturesBalance());
                // store.dispatch(getUserEarnedBalance(EarnWalletType.STAKING))
                // store.dispatch(getUserEarnedBalance(EarnWalletType.FARMING))
            }
        }
    });

    return (
        <>
            <Head language={language}/>
            <Provider store={store}>
                <Tracking>
                    <Component {...pageProps} />
                </Tracking>
            </Provider>
        </>
    );
};

export default appWithTranslation(App);
