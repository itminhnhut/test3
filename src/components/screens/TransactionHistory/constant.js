import { PATHS } from 'constants/paths';
export const TransactionTabs = [
    {
        key: '',
        localized: 'Tất cả',
        href: PATHS.TRANSACTION_HISTORY.DEFAULT
    },
    {
        key: 'deposit',
        localized: 'nạp',
        href: PATHS.TRANSACTION_HISTORY.DEPOSIT
    },
    {
        key: 'withdraw',
        localized: 'rút',
        href: PATHS.TRANSACTION_HISTORY.WITHDRAW
    },
    {
        key: 'exchange',
        localized: 'exchange',
        href: PATHS.TRANSACTION_HISTORY.EXCHANGE
    },
    {
        key: 'futures',
        localized: 'futures',
        href: PATHS.TRANSACTION_HISTORY.FUTURES
    },
    {
        key: 'transfer',
        localized: 'Chuyển đổi',
        href: PATHS.TRANSACTION_HISTORY.TRANSFER
    },
    {
        key: 'wallet-exchange',
        localized: 'Chuyển ví',
        href: PATHS.TRANSACTION_HISTORY.WALLET_EXCHANGE
    },
    {
        key: 'daily-staking',
        localized: 'Lãi hằng ngày',
        href: PATHS.TRANSACTION_HISTORY.DAILY_STAKING
    },
    {
        key: 'referral',
        localized: 'Hoa hồng',
        href: PATHS.TRANSACTION_HISTORY.REFERRAL
    }
];
