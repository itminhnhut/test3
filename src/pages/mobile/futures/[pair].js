import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoadingPage from 'components/screens/Nao_futures/LoadingPage';
const FuturesMobileComponent = dynamic(
    () => import('components/screens/Nao_futures/Futures/Futures'),
    { ssr: true, loading: () => <LoadingPage /> }
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
                'error',
                'markets'
            ])),
        },
    };
};
export default FuturesMobile;
