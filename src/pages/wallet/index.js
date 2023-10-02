import { useRouter } from 'next/router';

import { PATHS } from 'constants/paths';

const WalletDefault = ({ token }) => {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.push(PATHS.WALLET.OVERVIEW, undefined, { shallow: true });
    }
    return null;
};

export const WALLET_SCREENS = {
    OVERVIEW: 'overview',
    EXCHANGE: 'exchange',
    FUTURES: 'futures',
    // STAKING: 'staking',
    PARTNERS: 'partners',
    NAO_FUTURES: 'nao-futures',
    INSURANCE: 'insurance',
    EARN: 'earn',
    // FARMING: 'farming',
    TRANSACTION_HISTORY: 'transaction-history/all',
    NFT: 'NFT'
};

export const EXCHANGE_ACTION = {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    TRANSFER: 'transfer',
    PORTFOLIO: 'portfolio'
};

export default WalletDefault;
