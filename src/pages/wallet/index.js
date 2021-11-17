import { useRouter } from 'next/router'

const WalletDefault = ({ token }) => {
    const router = useRouter()
    if (typeof window !== 'undefined') {
        router.push(`/wallet/${WALLET_SCREENS.OVERVIEW}`,
                    undefined,
                    { shallow: true })
    }
    return null
}

export const WALLET_SCREENS = {
    OVERVIEW: 'overview',
    EXCHANGE: 'exchange',
    FUTURES: 'futures',
    STAKING: 'staking',
    FARMING: 'farming',
    TRANSACTION_HISTORY: 'transaction-history'
}

export const EXCHANGE_ACTION = {
    DEPOSIT: 'deposit',
    WITHDRAWL: 'withdraw',
    TRANSFER: 'transfer',
    PORTFOLIO: 'portfolio'
}

export default WalletDefault
