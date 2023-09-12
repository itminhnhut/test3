import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FuturesComponent = dynamic(() => import('components/screens/Futures/futures'), {
    ssr: false
});
const FundingHistory = dynamic(() => import('components/screens/Futures/FundingHistory'), {
    ssr: false
});
const TradingRule = dynamic(() => import('components/screens/Futures/TradingRule/TradingRule'), {
    ssr: false
});

const Futures = ({ params, query }) => {
    switch (params?.pair) {
        case 'funding-history':
            return <FundingHistory />;
        case 'trading-rule':
            return <TradingRule />;
        default:
            return <FuturesComponent symbol={params?.pair} integrate={query?.integrate} orderId={query?.order} />;
    }
};

export const getServerSideProps = async ({ locale, params, query }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'trade', 'futures', 'wallet', 'error', 'spot'])),
            params,
            query
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
