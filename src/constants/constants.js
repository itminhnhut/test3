export const EMPTY_VALUE = '--'

export const ROOT_TOKEN = 'NAMI'

export const USER_DEVICE_STATUS = {
    NORMAL: 0, //
    REVOKED: 1, // Force logged out
    BANNED: 2, // Banned
    LOGGED_OUT: 3, // User logged out normally
    WAITING_FOR_AUTHORIZATION: 4, // Wait to be authorized
}

export const ASSET_IGNORE = [
    'TURN_CHRISTMAS_2017',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_CONQUEST',
    'SPIN_BONUS',
    'SPIN_SPONSOR',
    'XBT_PENDING',
]

export const TERM_OF_SERVICE = {
    SWAP: '/',
}

export const BREAK_POINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

export const FEE_STRUCTURES = {
    EXCHANGE: {
        DEDUCTION: 25,
        MAKER_TAKER: {
            MAKER: ['0.075000', '0.10000'],
            TAKER: ['0.075000', '0.10000'],
        },
    },
    FUTURES: {
        VNDC: {
            DEDUCTION: 13,
            MAKER_TAKER: {
                MAKER: ['0.075000', '0.10000'],
                TAKER: ['0.075000', '0.10000'],
            },
        },
        USDT: {
            DEDUCTION: 13,
            MAKER_TAKER: {
                MAKER: ['0.075000', '0.10000'],
                TAKER: ['0.075000', '0.10000'],
            },
        },
    },
}

export const FEE_TABLE = [
    {
        level: 0,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 0,
        maker_taker: '0.1000% / 0.1000%',
        maker_taker_deducted: '0.07500% / 0.07500%',
    },
    {
        level: 1,
        vol_30d: '≥ 50 BTC',
        andor: 'or',
        nami_holding: 2e4,
        maker_taker: '0.07800% / 0.07900%',
        maker_taker_deducted: '0.05850% / 0.05925%',
    },
    {
        level: 2,
        vol_30d: '≥ 500 BTC',
        andor: 'or',
        nami_holding: 5e4,
        maker_taker: '0.07600% / 0.07800%',
        maker_taker_deducted: '0.05699% / 0.05850%',
    },
    {
        level: 3,
        vol_30d: '≥ 1500 BTC',
        andor: 'or',
        nami_holding: 1e5,
        maker_taker: '0.07300% / 0.07600%',
        maker_taker_deducted: '0.05475% / 0.05699%',
    },
    {
        level: 4,
        vol_30d: '≥ 4500 BTC',
        andor: 'or',
        nami_holding: 2e5,
        maker_taker: '0.07000% / 0.07300%',
        maker_taker_deducted: '0.05250% / 0.05475%',
    },
    {
        level: 5,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 5e5,
        maker_taker: ' 0.06500% / 0.06999%',
        maker_taker_deducted: '0.04874% / 0.05250%',
    },
    {
        level: 6,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 1e6,
        maker_taker: '0.06000% / 0.06500%',
        maker_taker_deducted: '0.04500% / 0.04874%',
    },
    {
        level: 7,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 2e6,
        maker_taker: '0.05500% / 0.06000%',
        maker_taker_deducted: '0.04125% / 0.04500%',
    },
    {
        level: 8,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 3e6,
        maker_taker: '0.05000% / 0.05500%',
        maker_taker_deducted: '0.03750% / 0.04125%',
    },
    {
        level: 9,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 5e6,
        maker_taker: '0.04000% / 0.04500%',
        maker_taker_deducted: '0.03000% / 0.03375%',
    },
]

export const TEST_ID = ['Nami852TPE2694', 'Nami527EBA4688']

export const MIN_WALLET = 1e-10

export const PORTAL_MODAL_ID = 'PORTAL_MODAL'

export const LOCAL_STORAGE_KEY = {
    PreviousFuturesPair: 'previous_futures_pair',
}
