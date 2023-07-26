import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const WalletDetail = dynamic(() => import('components/screens/Wallet/NFT/details'), { ssr: false });

const index = ({ idNFT }) => {
    return <WalletDetail idNFT={idNFT} />;
};

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { id: '' } }],
        fallback: true
    };
};

export const getStaticProps = async ({ locale, params }) => ({
    props: {
        idNFT: params.id,
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'staking', 'profile', 'nft']))
    }
});

export default index;
