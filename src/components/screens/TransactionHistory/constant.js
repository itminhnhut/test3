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
        key: TRANSACTION_TYPES.FIAT,
        localized: 'fiat',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.FIAT)
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
    STAKING_SNAPSHOT: 'staking_snapshot',
    FIAT_USER: 'fiat_user'
};

export const modalDetailColumn = {
    [TRANSACTION_TYPES.CONVERT]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['additionalData.fromQty', 'additionalData.fromAsset'], localized: 'Từ' },
        { keys: ['additionalData.toQty', 'additionalData.toAsset'], localized: 'Sang' },
        { keys: ['rate'], localized: 'Giá quy đổi', type: COLUMNS_TYPE.RATE }
    ],
    [TRANSACTION_TYPES.CONVERTSMALLBALANCE]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, primaryTeal: true },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['assets'], localized: 'Số lượng tài sản', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.DEPOSITWITHDRAW]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['additionalData.from.address', ''], localized: 'Từ', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['additionalData.to.address'], localized: 'Đến', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['additionalData.network'], localized: 'Mạng' },
        { keys: ['additionalData.metadata.txhash'], localized: 'Tx Hash', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true }
    ],
    [TRANSACTION_TYPES.FUTURES]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, primaryTeal: true },
        { keys: ['additionalData.closed_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['additionalData.symbol'], localized: 'Cặp giao dịch', type: COLUMNS_TYPE.SYMBOL },
        { keys: ['additionalData.open_price'], localized: 'Giá mở', type: COLUMNS_TYPE.FUTURES_ORDER },
        { keys: ['additionalData.side', 'additionalData.type'], localized: 'Loại', primaryTeal: true },
        { keys: ['additionalData.request_id.place'], localized: 'ID Vị thế', primaryTeal: true }
    ],
    [TRANSACTION_TYPES.EXCHANGE]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['additionalData.symbol'], localized: 'Cặp giao dịch', type: COLUMNS_TYPE.SYMBOL },

        { keys: ['additionalData.price'], localized: 'Giá mở', type: COLUMNS_TYPE.FUTURES_ORDER },
        { keys: ['additionalData.side', 'additionalData.type'], localized: 'Loại', primaryTeal: true }
    ],
    [TRANSACTION_TYPES.TRANSFER]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['additionalData.from_wallet'], localized: 'Từ', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.to_wallet'], localized: 'Sang', type: COLUMNS_TYPE.WALLET_TYPE }
    ],
    [TRANSACTION_TYPES.REWARD]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['nami_system'], localized: 'Từ', type: COLUMNS_TYPE.NAMI_SYSTEM },
        { keys: ['additionalData.reward'], localized: 'Số lượng tài sản', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.STAKING]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['nami_system'], localized: 'Từ', type: COLUMNS_TYPE.NAMI_SYSTEM },
        {
            keys: ['additionalData.snapshotValue', 'additionalData.snapshotAssetId'],
            localized: 'Giá trị tài sản ghi nhận tại thời điểm quét',
            type: COLUMNS_TYPE.STAKING_SNAPSHOT
        }
    ],
    [TRANSACTION_TYPES.FIAT]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME },
        { keys: ['additionalData.partnerMetadata.name', 'additionalData.fromNamiId.code'], localized: 'Từ', type: COLUMNS_TYPE.FIAT_USER },
        { keys: ['additionalData.transferMetadata.accountName', 'additionalData.toNamiId.code'], localized: 'Đến', type: COLUMNS_TYPE.FIAT_USER },
    ],
    common: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE },
        { keys: ['result.created_at'], localized: 'Thời gian', type: COLUMNS_TYPE.TIME }
    ]
};
