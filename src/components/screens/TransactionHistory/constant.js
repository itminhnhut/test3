import { PATHS } from 'constants/paths';

export const INITAL_FILTER = {
    range: {
        startDate: null,
        endDate: null,
        key: 'selection'
    },
    category: null,
    asset: null
};

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
    COMMISSION: 'commision'
};

export const TransactionTabs = [
    {
        key: 'all',
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
        key: TRANSACTION_TYPES.COMMISSION,
        localized: 'Hoa hồng',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.COMMISSION)
    }
];

export const COLUMNS_TYPE = {
    TIME: 'time',
    COPIEDABLE: 'copiedable',
    RATE: 'rate',
    ADDITIONAL_FIELD: 'additional_field',
    SYMBOL: 'symbol',
    FUTURES_ORDER: 'futures_order',
    NUMBER_OF_ASSETS: 'number_of_assets',
    WALLET_TYPE: 'wallet_type',
    NAMI_SYSTEM: 'nami_system',
    STAKING_SNAPSHOT: 'staking_snapshot'
};

export const modalDetailColumn = {
    [TRANSACTION_TYPES.CONVERT]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['createdAt'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['fromQty', 'fromAsset'], localized: 'Từ' },
        { keys: ['toQty', 'toAsset'], localized: 'Sang' },
        { keys: ['rate'], localized: 'Giá quy đổi', type: COLUMNS_TYPE.RATE }
    ],
    [TRANSACTION_TYPES.CONVERTSMALLBALANCE]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, primaryTeal: true },
        { keys: ['createdAt'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['assets'], localized: 'Số lượng tài sản', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.DEPOSITWITHDRAW]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['from.address'], localized: 'Từ', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true  },
        { keys: ['to.address'], localized: 'Đến', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['network'], localized: 'Mạng' },
        { keys: ['metadata.txhash'], localized: 'Tx Hash', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true }
    ],
    [TRANSACTION_TYPES.FUTURES]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, primaryTeal: true },
        { keys: ['closed_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['symbol'], localized: 'Cặp giao dịch', type: COLUMNS_TYPE.SYMBOL },
        { keys: ['open_price'], localized: 'Giá mở', type: COLUMNS_TYPE.FUTURES_ORDER },
        { keys: ['side', 'type'], localized: 'Loại', primaryTeal: true },
        { keys: ['request_id.place'], localized: 'ID Vị thế', primaryTeal: true }
    ],
    [TRANSACTION_TYPES.EXCHANGE]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['createdAt'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['symbol'], localized: 'Cặp giao dịch', type: COLUMNS_TYPE.SYMBOL },

        { keys: ['price'], localized: 'Giá mở', type: COLUMNS_TYPE.FUTURES_ORDER },
        { keys: ['side', 'type'], localized: 'Loại', primaryTeal: true }
    ],
    [TRANSACTION_TYPES.TRANSFER]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['from_wallet'], localized: 'Từ', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['to_wallet'], localized: 'Sang', type: COLUMNS_TYPE.WALLET_TYPE }
    ],
    [TRANSACTION_TYPES.REWARD]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['nami_system'], localized: 'Từ', type: COLUMNS_TYPE.NAMI_SYSTEM },
        { keys: ['reward'], localized: 'Số lượng tài sản', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.STAKING]: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['nami_system'], localized: 'Từ', type: COLUMNS_TYPE.NAMI_SYSTEM },
        { keys: ['snapshotValue', 'snapshotAssetId'], localized: 'Giá trị tài sản ghi nhận tại thời điểm quét', type: COLUMNS_TYPE.STAKING_SNAPSHOT }
    ],
    common: [
        { keys: ['_id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME }
    ]
};
