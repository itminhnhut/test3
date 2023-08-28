import { TRADING_MODE } from 'redux/actions/const';
import { getV1Url } from 'redux/actions/utils';

const DEFAULT_BASE_ASSET = 'BTC';
const DEFAULT_QUOTE_ASSET = 'USDT';
const DEFAULT_PAIR = `${DEFAULT_BASE_ASSET}-${DEFAULT_QUOTE_ASSET}`;

const SUPPORT = {
    DEFAULT: '/support',
    FAQ: '/support/faq',
    ANNOUNCEMENT: '/support/announcement',
    SEARCH: '/support/search',
    TOPICS: '/support/announcement/[topic]',
    ARTICLES: '/support/announcement/[topic]/[articles]'
};

const EXCHANGE = {
    TRADE: {
        DEFAULT: '/trade',
        getPair: (tradingMode, pair) => getPair(tradingMode, pair)
    },
    SWAP: {
        DEFAULT: '/swap',
        getSwapPair: (pair) => getSwapPair(pair)
    },
    PORTFOLIO: getV1Url('/account?type=portfolio')
};

const FUTURES = {
    TRADE: {
        DEFAULT: getV1Url('/futures'),
        getPair: (tradingMode, pair) => getPair(tradingMode, pair)
    },
    PORTFOLIO: getV1Url('/account?type=futures')
};

const WALLET = {
    DEFAULT: '/wallet',
    OVERVIEW: '/wallet/overview',
    EXCHANGE: {
        DEFAULT: '/wallet/exchange',
        DEPOSIT: '/wallet/exchange/deposit',
        WITHDRAW: '/wallet/exchange/withdraw'
    },
    FUTURES: '/wallet/futures',
    STAKING: '/wallet/staking',
    FARMING: '/wallet/farming',
    TRANSTION_HISTORY: '/wallet/transaction-history',
    NFT: '/wallet/NFT'
};

const FEE_STRUCTURES = {
    DEFAULT: '/fee-schedule',
    TRADING: '/fee-schedule/trading',
    DEPWDL: '/fee-schedule/depositwithdraw'
};

const TERM_OF_SERVICES = {
    DEFAULT: '/terms-of-service',
    SWAP: '/terms-of-service',
    TRANSFER: '/terms-of-service'
};

const ACCOUNT = {
    DEFAULT: '/account',
    PROFILE: '/account/profile',
    SECURITY: '/account/security',
    IDENTIFICATION: '/account/identification',
    REWARD_CENTER: '/account/reward-center',
    PAYMENT_METHOD: '/account/payment-method',
    REFERRAL: getV1Url('/reference'),
    REFERRAL_VI: getV1Url('/vi/reference'),
    SETTINGS: '/account/settings'
};

const REFERENCE = {
    HOW_TO_UPGRADE_VIP: '/support/announcement/thong-bao/nami-corporation-thong-bao-cap-nhat-chinh-sach-tai-khoan-vip',
    HOW_TO_UPGRADE_VIP_EN: '/support/announcement/nami-news/announcement-nami-corporation-updates-vip-account-policy',
    MAKER_TAKER: 'https://nami.today/maker-taker-la-gi/'
};

const FUTURES_V2 = {
    DEFAULT: '/futures'
};

const TRANSACTION_HISTORY = {
    DEFAULT: '/transaction-history',
    TYPE: (type) => `/transaction-history/${type}`
};

const WITHDRAW_DEPOSIT = {
    DEFAULT: '/withdraw-deposit/crypto',
    PARTNER: '/withdraw-deposit/partner',
    ID_EMAIL: '/withdraw-deposit/namiid-email',
    DETAIL: '/withdraw-deposit/partner/details'
};

export const PARTNER_WD_TABS = {
    OPEN_ORDER: 'opening-orders',
    HISTORY_ORDER: 'history-orders',
    STATS: 'stats',
    PROFILE: 'profile',
    HISTORY_REFERRAL: 'history-referral',
    DETAILS: 'details'
};

const PARTNER_WITHDRAW_DEPOSIT = {
    DEFAULT: '/partner-dw/',
    OPEN_ORDER: `/partner-dw/${PARTNER_WD_TABS.OPEN_ORDER}`,
    HISTORY_ORDER: `/partner-dw/${PARTNER_WD_TABS.HISTORY_ORDER}`,
    STATS: `/partner-dw/${PARTNER_WD_TABS.STATS}`,
    PROFILE: `/partner-dw/${PARTNER_WD_TABS.PROFILE}`,
    HISTORY_REFERRAL: `/partner-dw/${PARTNER_WD_TABS.HISTORY_REFERRAL}`,
    DETAILS: `/partner-dw/${PARTNER_WD_TABS.DETAILS}`
};

export const PATHS = {
    ACCOUNT,
    WALLET,
    EXCHANGE,
    FUTURES,
    FUTURES_V2,
    FEE_STRUCTURES,
    TERM_OF_SERVICES,
    REFERENCE,
    SUPPORT,
    TRANSACTION_HISTORY,
    WITHDRAW_DEPOSIT,
    PARTNER_WITHDRAW_DEPOSIT,
    FUTURES_PORTFOLIO: '/statistics'
    // Add news path here
};

const getPair = (tradingMode = TRADING_MODE.EXCHANGE, pair) => {
    switch (tradingMode) {
        case TRADING_MODE.EXCHANGE: {
            if (pair?.pair) {
                return `${PATHS.EXCHANGE.TRADE.DEFAULT}/${pair?.pair || DEFAULT_PAIR}`;
            }

            if (pair?.baseAsset && pair?.quoteAsset) {
                return `${PATHS.EXCHANGE.TRADE.DEFAULT}/${pair?.baseAsset || DEFAULT_BASE_ASSET}-${pair?.quoteAsset || DEFAULT_QUOTE_ASSET}`;
            }

            return PATHS.EXCHANGE.TRADE.DEFAULT;
        }
        case TRADING_MODE.FUTURES: {
            if (pair?.pair) {
                return `${PATHS.FUTURES.TRADE.DEFAULT}/${pair?.pair || DEFAULT_PAIR}`;
            }

            if (pair?.baseAsset && pair?.quoteAsset) {
                return `${PATHS.FUTURES.TRADE.DEFAULT}/${pair?.baseAsset || DEFAULT_BASE_ASSET}${pair?.quoteAsset || DEFAULT_QUOTE_ASSET}`;
            }

            return PATHS.FUTURES.TRADE.DEFAULT;
        }
        default:
            return tradingMode === TRADING_MODE.EXCHANGE ? PATHS.EXCHANGE.TRADE.DEFAULT : PATHS.FUTURES.TRADE.DEFAULT;
    }
};

const getSwapPair = (pair) => {
    const _pair = {};

    if (Object.keys(pair).length) {
        if (pair?.fromAsset) {
            _pair.fromAsset = pair?.fromAsset;
        }

        if (pair?.toAsset) {
            _pair.toAsset = pair?.toAsset;
        }

        return PATHS.EXCHANGE.SWAP.DEFAULT + `?fromAsset=${_pair?.fromAsset || DEFAULT_BASE_ASSET}&toAsset=${_pair?.toAsset || DEFAULT_QUOTE_ASSET}`;
    }

    return PATHS.EXCHANGE.SWAP.DEFAULT;
};
