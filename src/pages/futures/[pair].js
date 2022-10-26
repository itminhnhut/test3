import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FUTURES_DEFAULT_SYMBOL } from './index';

const FuturesComponent = dynamic(() => import('components/screens/Futures/futures'), {
    ssr: false
});
const FundingHistory = dynamic(() => import('components/screens/Futures/FundingHistory'), {
    ssr: false
});
const TradingRule = dynamic(() => import('components/screens/Futures/TradingRule/TradingRule'), {
    ssr: false
});

const Futures = ({ params }) => {
    switch (params?.pair) {
        case 'funding-history':
            return <FundingHistory />
        case 'trading-rule':
            return <TradingRule />
        default:
            return <FuturesComponent />;
    }
};



export const getServerSideProps = async ({ locale, params }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'error',
                'spot'
            ])),
            params
        }
    };
};

// export const getStaticPaths = async () => {
//     return {
//         paths: [{ params: { pair: FUTURES_DEFAULT_SYMBOL } }],
//         fallback: true
//     };
// };

export default Futures;
