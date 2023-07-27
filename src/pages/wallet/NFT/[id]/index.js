import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';

const WalletDetail = dynamic(() => import('components/screens/Wallet/NFT/Details'), { ssr: false });

const index = ({ idNFT }) => {
    return <WalletDetail idNFT={idNFT} />;
};

export const getStaticPaths = async () => {
    return {
        paths: [],
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
