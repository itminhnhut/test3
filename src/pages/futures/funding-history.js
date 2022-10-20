import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';

const FundingHistory = dynamic(
    () => import('components/screens/Futures/FundingHistory'),
    { ssr: false }
);
const Futures = () => {
    return <FundingHistory />
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'error',
                'spot',
            ])),
        },
    };
};


export default Futures;
