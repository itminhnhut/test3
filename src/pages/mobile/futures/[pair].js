import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoadingPage from 'components/screens/Mobile/LoadingPage';

const FuturesMobileComponent = dynamic(
    () => import('components/screens/Mobile/Futures/Futures'),
    { ssr: false, loading: () => <LoadingPage /> }
);
const FuturesMobile = () => {
    return <FuturesMobileComponent />
};


export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'spot',
                'markets'
            ])),
        },
    };
};

// export const getStaticProps = async ({locale}) => {
//     return {
//         props: {
//             ...(await serverSideTranslations(locale, [
//                 'common',
//                 'navbar',
//                 'trade',
//                 'futures',
//                 'wallet',
//                 'spot',
//                 'markets'
//             ])),
//         },
//     };
// };

// export const getStaticPaths = async () => {
//     return {
//         paths: [{params: {pair: FUTURES_DEFAULT_SYMBOL}}],
//         fallback: true,
//     };
// };

export default FuturesMobile;
