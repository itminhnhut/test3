import { getV1Url } from 'redux/actions/utils'
import { TRADING_MODE } from 'redux/actions/const'

const DEFAULT_BASE_ASSET = 'BTC'
const DEFAULT_QUOTE_ASSET = 'USDT'
const DEFAULT_PAIR = `${DEFAULT_BASE_ASSET}-${DEFAULT_QUOTE_ASSET}`

export const PATHS = {
    WALLET: {
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
        TRANSTION_HISTORY: '/wallet/transaction-history'
    },
    EXCHANGE: {
        TRADE: {
            DEFAULT: '/trade',
            getPair: (tradingMode, pair) => getPair(tradingMode, pair)
        },
        SWAP: {
            DEFAULT: '/swap',
            getSwapPair: (pair) => getSwapPair(pair)
        },
        PORTFOLIO: getV1Url('/account?type=portfolio')
    },
    FUTURES: {
        TRADE: {
            DEFAULT: getV1Url('/futures')

        },
        PORTFOLIO: getV1Url('/account?type=futures')
    }
}

const getPair = (tradingMode = TRADING_MODE.EXCHANGE, pair) => {
    switch (tradingMode) {
        case TRADING_MODE.EXCHANGE: {
            if (pair?.pair) {
                return `${PATHS.EXCHANGE.TRADE.DEFAULT}/${pair?.pair || DEFAULT_PAIR}`
            }

            if (pair?.baseAsset && pair?.quoteAsset) {
                return `${PATHS.EXCHANGE.TRADE.DEFAULT}/${pair?.baseAsset || DEFAULT_BASE_ASSET}-${pair?.quoteAsset || DEFAULT_QUOTE_ASSET}`
            }

            return PATHS.EXCHANGE.TRADE.DEFAULT
        }
        case TRADING_MODE.FUTURES: {
            if (pair?.pair) {
                return `${PATHS.FUTURES.TRADE.DEFAULT}/${pair?.pair || DEFAULT_PAIR}`
            }

            if (pair?.baseAsset && pair?.quoteAsset) {
                return `${PATHS.FUTURES.TRADE.DEFAULT}/${pair?.baseAsset || DEFAULT_BASE_ASSET}-${pair?.quoteAsset || DEFAULT_QUOTE_ASSET}`
            }

            return PATHS.FUTURES.TRADE.DEFAULT
        }
        default:
            return tradingMode === TRADING_MODE.EXCHANGE ? PATHS.EXCHANGE.TRADE.DEFAULT : PATHS.FUTURES.TRADE.DEFAULT
    }
}

const getSwapPair = (pair) => {
    const _pair = {}

    if (Object.keys(pair).length) {
        if (pair?.fromAsset) {
            _pair.fromAsset = pair?.fromAsset
        }

        if (pair?.toAsset) {
            _pair.toAsset = pair?.toAsset
        }

        return PATHS.EXCHANGE.SWAP.DEFAULT + `?fromAsset=${_pair?.fromAsset || DEFAULT_BASE_ASSET}&toAsset=${_pair?.toAsset || DEFAULT_QUOTE_ASSET}`
    }

    return PATHS.EXCHANGE.SWAP.DEFAULT
}
