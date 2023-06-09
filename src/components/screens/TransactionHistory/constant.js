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
    NAO_FUTURES: 'nao',
    EXCHANGE: 'exchange',
    FUTURES_FEE: 'futures_fee',
    EXCHANGE_FEE: 'exchange_fee',
    CONVERTSMALLBALANCE: 'convertsmallbalance',
    REWARD: 'reward',
    FUTURESCOMMISSION: 'futurescommission',
    PARTNERCOMMISSION: 'partnercommission',
    COMMISSION: 'commision'
};

export const TransactionTabs = [
    {
        key: 'all',
        localized: 'all',
        href: PATHS.TRANSACTION_HISTORY.DEFAULT
    },
    {
        key: TRANSACTION_TYPES.DEPOSIT,
        localized: 'deposit_onchain',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.DEPOSIT)
    },
    {
        key: TRANSACTION_TYPES.WITHDRAW,
        localized: 'withdraw_onchain',
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
        key: TRANSACTION_TYPES.NAO_FUTURES,
        localized: 'nao',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.NAO_FUTURES)
    },
    {
        key: TRANSACTION_TYPES.CONVERT,
        localized: 'convert',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.CONVERT)
    },
    {
        key: TRANSACTION_TYPES.TRANSFER,
        localized: 'transfer',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.TRANSFER)
    },
    {
        key: TRANSACTION_TYPES.STAKING,
        localized: 'staking',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.STAKING)
    },
    {
        key: TRANSACTION_TYPES.REWARD,
        localized: 'commission',
        href: PATHS.TRANSACTION_HISTORY.TYPE(TRANSACTION_TYPES.REWARD)
    }
];

export const COLUMNS_TYPE = {
    TIME: 'time',
    COPIEDABLE: 'copiedable',
    RATE: 'rate',
    ADDITIONAL_FIELD: 'additional_field',
    SYMBOL: 'symbol',
    FUTURES_ORDER: 'futures_order',
    DEPOSIT_WITHDRAW_FEE: 'deposit_withdraw_fee',
    NUMBER_OF_ASSETS: 'number_of_assets',
    WALLET_TYPE: 'wallet_type',
    NAMI_SYSTEM: 'nami_system',
    STAKING_SNAPSHOT: 'staking_snapshot',
    FIAT_USER: 'fiat_user',
    SIDETYPE: 'sidetype',
    FUTURES_ORDER_VALUE: 'futures_order_value',
    CONVERT_ASSET: 'convert_asset'
};

export const modalDetailColumn = {
    [TRANSACTION_TYPES.CONVERT]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        {
            keys: ['additionalData.displayingId'],
            backupKeys: ['result.metadata.displayingId'],
            localized: 'modal_detail.order_id'
        },
        {
            keys: ['additionalData.fromQty', 'additionalData.fromAsset'],
            backupKeys: ['result.metadata.fromQty', 'result.metadata.fromAsset'],
            localized: 'modal_detail.from',
            type: COLUMNS_TYPE.CONVERT_ASSET
        },
        {
            keys: ['additionalData.toQty', 'additionalData.toAsset'],
            backupKeys: ['result.metadata.toQty', 'result.metadata.toAsset'],
            localized: 'modal_detail.to',
            type: COLUMNS_TYPE.CONVERT_ASSET
        },
        { keys: ['rate'], localized: 'modal_detail.rate', type: COLUMNS_TYPE.RATE }
    ],
    [TRANSACTION_TYPES.CONVERTSMALLBALANCE]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, primaryTeal: true, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['assets'], localized: 'modal_detail.assets_number', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.DEPOSITWITHDRAW]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.metadata.address'], localized: 'modal_detail.from', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['additionalData.to.address'], localized: 'modal_detail.to', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['additionalData.fee.value'], localized: 'modal_detail.fee', type: COLUMNS_TYPE.DEPOSIT_WITHDRAW_FEE },
        { keys: ['additionalData.network'], localized: 'modal_detail.network' },
        { keys: ['additionalData.metadata.txhash'], localized: 'modal_detail.txhash', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true }
    ],
    [TRANSACTION_TYPES.FUTURES]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.symbol'], localized: 'modal_detail.pair', type: COLUMNS_TYPE.SYMBOL },
        // { keys: ['additionalData.close_price'], localized: 'modal_detail.close_price', type: COLUMNS_TYPE.FUTURES_ORDER },
        { keys: ['additionalData.side', 'additionalData.type'], localized: 'modal_detail.type', primaryTeal: true, type: COLUMNS_TYPE.SIDETYPE },
        {
            keys: ['additionalData.order_value'],
            type: COLUMNS_TYPE.FUTURES_ORDER,
            localized: 'modal_detail.volume'
        }
        // { keys: ['additionalData.request_id.place'], localized: 'modal_detail.position_id', primaryTeal: true }
    ],
    [TRANSACTION_TYPES.EXCHANGE]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.symbol'], localized: 'modal_detail.pair', type: COLUMNS_TYPE.SYMBOL },

        // { keys: ['additionalData.price'], localized: 'modal_detail.open_price', type: COLUMNS_TYPE.FUTURES_ORDER },
        { keys: ['additionalData.side', 'additionalData.type'], localized: 'modal_detail.type', type: COLUMNS_TYPE.SIDETYPE }
    ],
    [TRANSACTION_TYPES.TRANSFER]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.from_wallet'], localized: 'modal_detail.from', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.to_wallet'], localized: 'modal_detail.to', type: COLUMNS_TYPE.WALLET_TYPE }
    ],
    [TRANSACTION_TYPES.REWARD]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['nami_system'], localized: 'modal_detail.from', type: COLUMNS_TYPE.NAMI_SYSTEM },
        { keys: ['additionalData.reward'], localized: 'modal_detail.assets_number', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.PARTNERCOMMISSION]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['nami_system'], localized: 'modal_detail.from', type: COLUMNS_TYPE.NAMI_SYSTEM }
        // { keys: ['additionalData.reward'], localized: 'modal_detail.assets_number', type: COLUMNS_TYPE.NUMBER_OF_ASSETS }
    ],
    [TRANSACTION_TYPES.STAKING]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['nami_system'], localized: 'modal_detail.from', type: COLUMNS_TYPE.NAMI_SYSTEM },
        {
            keys: ['additionalData.snapshotValue', 'additionalData.snapshotAssetId'],
            localized: 'modal_detail.snapshot_value',
            type: COLUMNS_TYPE.STAKING_SNAPSHOT
        }
    ],
    [TRANSACTION_TYPES.FIAT]: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE },
        { keys: ['additionalData.fromNamiId.name', 'additionalData.fromNamiId.code'], localized: 'modal_detail.from', type: COLUMNS_TYPE.FIAT_USER },
        { keys: ['additionalData.toNamiId.name', 'additionalData.toNamiId.code'], localized: 'modal_detail.to', type: COLUMNS_TYPE.FIAT_USER }
    ],
    common: [
        { keys: ['result._id'], localized: 'ID', type: COLUMNS_TYPE.COPIEDABLE, isAddress: true },
        { keys: ['result.created_at'], localized: 'modal_detail.time', type: COLUMNS_TYPE.TIME },
        { keys: ['result.wallet_type'], localized: 'modal_detail.wallet_type', type: COLUMNS_TYPE.WALLET_TYPE }
    ]
};
