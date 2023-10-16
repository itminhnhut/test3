import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { PATHS } from './paths';

export const EMPTY_VALUE = '--';

export const ONE_DAY = 86400000;

export const INSURANCE_URL = process.env.NEXT_PUBLIC_INSURANCE_URL || 'https://namiinsurance.io/';
export const NAMI_FUTURES_EARNED_SHARE = 'NamiFutures_TakeProfit_';

export const ROOT_TOKEN = 'NAMI';

export const USER_DEVICE_STATUS = {
    NORMAL: 0, //
    REVOKED: 1, // Force logged out
    BANNED: 2, // Banned
    LOGGED_OUT: 3, // User logged out normally
    WAITING_FOR_AUTHORIZATION: 4 // Wait to be authorized
};

export const FUTURES_NUMBER_OF_CONTRACT = {
    longOrder: 1,
    shortOrder: -1
};

export const ASSET_IGNORE = [
    'TURN_CHRISTMAS_2017',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_CONQUEST',
    'SPIN_BONUS',
    'SPIN_SPONSOR',
    'XBT_PENDING'
];

export const TERM_OF_SERVICE = {
    SWAP: '/'
};

export const BREAK_POINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    mb: 820,
    xl: 1280,
    '2xl': 1536,
    footer: 1200
};

export const FEE_STRUCTURES = {
    EXCHANGE: {
        DEDUCTION: 25,
        MAKER_TAKER: {
            MAKER: ['0.075000', '0.10000'],
            TAKER: ['0.075000', '0.10000']
        }
    },
    FUTURES: {
        VNDC: {
            DEDUCTION: 13,
            MAKER_TAKER: {
                MAKER: ['0.04200', '0.06000'],
                TAKER: ['0.04200', '0.06000']
            }
        },
        USDT: {
            DEDUCTION: 13,
            MAKER_TAKER: {
                MAKER: ['0.04200', '0.06000'],
                TAKER: ['0.04200', '0.06000']
            }
        }
    }
};

export const NAMI_FEE_FUTURE = [
    { assetId: 72, assetCode: 'VNDC', ratio: '0.06%' },
    { assetId: 1, assetCode: 'NAMI', ratio: '0.042%' },
    { assetId: 22, assetCode: 'USDT', ratio: '0.06%' },
    { assetId: 39, assetCode: 'VNST', ratio: '0.06%' }
];

export const FEE_TABLE = [
    {
        level: 0,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 0,
        maker_taker: '0.1000% / 0.1000%',
        maker_taker_deducted: '0.07500% / 0.07500%'
    },
    {
        level: 1,
        vol_30d: '≥ 50 BTC',
        andor: 'or',
        nami_holding: 2e4,
        maker_taker: '0.07800% / 0.07900%',
        maker_taker_deducted: '0.05850% / 0.05925%'
    },
    {
        level: 2,
        vol_30d: '≥ 500 BTC',
        andor: 'or',
        nami_holding: 5e4,
        maker_taker: '0.07600% / 0.07800%',
        maker_taker_deducted: '0.05699% / 0.05850%'
    },
    {
        level: 3,
        vol_30d: '≥ 1500 BTC',
        andor: 'or',
        nami_holding: 1e5,
        maker_taker: '0.07300% / 0.07600%',
        maker_taker_deducted: '0.05475% / 0.05699%'
    },
    {
        level: 4,
        vol_30d: '≥ 4500 BTC',
        andor: 'or',
        nami_holding: 2e5,
        maker_taker: '0.07000% / 0.07300%',
        maker_taker_deducted: '0.05250% / 0.05475%'
    },
    {
        level: 5,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 5e5,
        maker_taker: ' 0.06500% / 0.06999%',
        maker_taker_deducted: '0.04874% / 0.05250%'
    },
    {
        level: 6,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 1e6,
        maker_taker: '0.06000% / 0.06500%',
        maker_taker_deducted: '0.04500% / 0.04874%'
    },
    {
        level: 7,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 2e6,
        maker_taker: '0.05500% / 0.06000%',
        maker_taker_deducted: '0.04125% / 0.04500%'
    },
    {
        level: 8,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 3e6,
        maker_taker: '0.05000% / 0.05500%',
        maker_taker_deducted: '0.03750% / 0.04125%'
    },
    {
        level: 9,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 5e6,
        maker_taker: '0.04000% / 0.04500%',
        maker_taker_deducted: '0.03000% / 0.03375%'
    }
];

export const FUTURES_ORDER_STATUS = {
    PENDING: '',
    OPENING: ''
};

export const TEST_ID = ['Nami852TPE2694', 'Nami527EBA4688'];

export const MIN_WALLET = 1e-10;

export const PORTAL_MODAL_ID = 'PORTAL_MODAL';

export const PRODUCT = {
    SPOT: 'Nami Spot',
    FUTURES: 'Nami Futures'
};

export const BINANCE_LEVERAGE_MARGIN = [
    {
        positionBracket: [0, 50000],
        maxLeverage: 125,
        rate: 125,
        amount: 0
    },
    {
        positionBracket: [50000, 250000],
        maxLeverage: 100,
        rate: 100,
        amount: 50
    },
    {
        positionBracket: [250000, 1000000],
        maxLeverage: 50,
        rate: 50,
        amount: 1300
    },
    {
        positionBracket: [1000000, 7500000],
        maxLeverage: 20,
        rate: 20,
        amount: 16300
    },
    {
        positionBracket: [7500000, 40000000],
        maxLeverage: 10,
        rate: 10,
        amount: 203800
    },
    {
        positionBracket: [40000000, 100000000],
        maxLeverage: 5,
        rate: 5,
        amount: 2203
    },
    {
        positionBracket: [100000000, 200000000],
        maxLeverage: 4,
        rate: 4,
        amount: 4703
    },
    {
        positionBracket: [200000000, 400000000],
        maxLeverage: 3,
        rate: 3,
        amount: 9703
    },
    {
        positionBracket: [400000000, 600000000],
        maxLeverage: 2,
        rate: 2,
        amount: 49703
    },
    {
        positionBracket: [600000000, 1000000000],
        maxLeverage: 1,
        rate: 1,
        amount: 199703
    }
];

export const MODE_OTP = {
    PHONE: 'phone',
    EMAIL: 'email',
    TFA: 'tfa',
    SMART_OTP: 'smartOtp'
};

export const FUTURES_PRODUCT = {
    NAMI: { id: 0, name: 'Nami Futures' },
    NAO: { id: 2, name: 'NAO Futures' }
};

export const CHART_JS_RANGE = {
    millisecond: 'millisecond',
    second: 'second',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    quarter: 'quarter',
    year: 'year'
};

export const CURRENCY = {
    USDT: 22,
    VNDC: 72,
    VNST: 39
};

export const FUTURES_DEFAULT_SYMBOL = 'BTC';

export const INSURANCE_STATE = {
    AVAILABLE: 'Available',
    CLAIM_WAITING: 'Claim_waiting',
    CLAIMED: 'Claimed',
    REFUNDED: 'Refunded',
    LIQUIDATED: 'Liquidated',
    EXPIRED: 'Expired',
    CANCELED: 'Canceled'
};

export const QUOTE_ASSET = {
    VNST: 39,
    VNDC: 72,
    USDT: 22
};

export const PATH_WITH_GHOST_ARTICLE_ID = {
    [LANGUAGE_TAG.EN]: {
        'terms-of-service': '64e7338c7022fbae9d5e3997',
        'terms-of-futures': '64e7344d7022fbae9d5e39a9',
        'terms-of-lending': '652cc3bd7022fbae9d5e5fbe',
        'terms-of-earn': '652cd33f7022fbae9d5e6000',
        licences: '64e735fe7022fbae9d5e39db',
        privacy: '64e735027022fbae9d5e39c3'
    },
    [LANGUAGE_TAG.VI]: {
        'terms-of-service': '64e732d37022fbae9d5e3986',
        'terms-of-futures': '64e734127022fbae9d5e39a1',
        'terms-of-lending': '652cc9447022fbae9d5e5fca',
        'terms-of-earn': '652cd3647022fbae9d5e6006',
        licences: '64e735547022fbae9d5e39c9',
        privacy: '64e734a37022fbae9d5e39b3'
    }
};
