import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const WalletDetail = dynamic(() => import('components/screens/Wallet/NFT/details'), { ssr: false });

const index = () => {
    return <WalletDetail />;
};

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { id: '' } }],
        fallback: true
    };
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'staking', 'profile']))
    }
});

export default index;
