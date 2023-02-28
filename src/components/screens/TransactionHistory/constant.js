import { PATHS } from 'constants/paths';

export const TRANSACTION_TYPES = {
    CONVERT: 'convert',
    DEPOSITWITHDRAW: 'depositwithdraw',
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    FIAT: 'fiat',
    FUNDING: 'funding',
    STAKING: 'staking',
    TRANSFER: 'transfer',
    FUTURES: 'futures',
    EXCHANGE: 'exchange',
    FUTURES_FEE: 'futures_fee',
    EXCHANGE_FEE: 'exchange_fee',
    CONVERTSMALLBALANCE: 'convertsmallbalance',
    REWARD: 'reward',
    FUTURESCOMMISSION: 'futurescommission',
}



export const TransactionTabs = [
    {
        key: '',
        localized: 'Tất cả',
        href: PATHS.TRANSACTION_HISTORY.DEFAULT
    },
    {
        key: TRANSACTION_TYPES.DEPOSIT,
        localized: 'nạp',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.DEPOSIT)
    },
    {
        key: TRANSACTION_TYPES.WITHDRAW,
        localized: 'rút',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.WITHDRAW)
    },
    {
        key: TRANSACTION_TYPES.EXCHANGE,
        localized: 'exchange',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.EXCHANGE)
    },
    {
        key: TRANSACTION_TYPES.FUTURES,
        localized: 'futures',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.FUTURES)
    },
    {
        key: TRANSACTION_TYPES.CONVERT,
        localized: 'Chuyển đổi',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.CONVERT)
    },
    {
        key: TRANSACTION_TYPES.TRANSFER,
        localized: 'Chuyển ví',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.TRANSFER)
    },
    {
        key: TRANSACTION_TYPES.STAKING,
        localized: 'Lãi hằng ngày',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.STAKING)
    },
    {
        key: TRANSACTION_TYPES.REWARD,
        localized: 'Hoa hồng',
        href: PATHS.TRANSACTION_HISTORY.TYPE( TRANSACTION_TYPES.REWARD)
    }
];
