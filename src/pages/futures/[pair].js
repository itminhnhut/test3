import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FUTURES_DEFAULT_SYMBOL } from './index';

const FuturesComponent = dynamic(() => import('components/screens/Futures/futures'), {
    ssr: false
});
const FundingHistory = dynamic(() => import('components/screens/Futures/FundingHistory'), {
    ssr: false
});

const Futures = ({ params }) => {
    if (!params?.pair || params?.pair === 'funding-history') {
        return <FundingHistory />;
    }
    return <FuturesComponent />;
};

export const getStaticProps = async ({ locale, params }) => {
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

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { pair: FUTURES_DEFAULT_SYMBOL } }],
        fallback: true
    };
};

export default Futures;
