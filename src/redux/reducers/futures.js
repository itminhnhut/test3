import {
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_USE_SLTP,
    GET_FUTURES_FAVORITE_PAIRS,
    SET_FUTURES_PAIR_CONFIGS,
    GET_FUTURES_MARKET_WATCH,
    SET_FUTURES_PRELOADED_FORM,
    SET_FUTURES_PRELOADED_LEVERAGE,
} from 'redux/actions/types'

export const FuturesOrderTypes = {
    Limit: 'LIMIT',
    Market: 'MARKET',
    StopLimit: 'STOP',
    StopMarket: 'STOP_MARKET',
    TakeProfit: 'TAKE_PROFIT',
    TakeProfitMarket: 'TAKE_PROFIT_MARKET',
    TrailingStopMarket: 'TRAILING_STOP_MARKET',
}

export const FuturesMarginMode = {
    Isolated: 'Isolated',
    Cross: 'Cross',
}

export const initialState = {
    pairConfigs: [],
    orderType: FuturesOrderTypes.Limit,
    orderAdvanceType: FuturesOrderTypes.StopLimit,
    useSltp: false,
    favoritePairs: [],
    marketWatch: [],
    preloadedLeverage: {
        // pair: leverage value
    },
    preloadedForm: {
        orderType: FuturesOrderTypes.Limit,
        orderAdvanceType: FuturesOrderTypes.StopLimit,
        marginMode: FuturesMarginMode.Cross,
        useSltp: false,
    },
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case SET_FUTURES_PAIR_CONFIGS:
            return { ...state, pairConfigs: payload }
        case SET_FUTURES_ORDER_TYPES:
            return { ...state, orderType: payload }
        case SET_FUTURES_ORDER_ADVANCE_TYPES:
            return { ...state, orderAdvanceType: payload }
        case SET_FUTURES_USE_SLTP:
            return { ...state, useSltp: payload }
        case GET_FUTURES_FAVORITE_PAIRS:
            return { ...state, favoritePairs: payload }
        case GET_FUTURES_MARKET_WATCH:
            return { ...state, marketWatch: payload }
        case SET_FUTURES_PRELOADED_FORM:
            return {
                ...state,
                preloadedForm: { ...state.preloadedForm, ...payload },
            }
        case SET_FUTURES_PRELOADED_LEVERAGE:
            return {
                ...state,
                preloadedLeverage: { ...state.preloadedLeverage, ...payload },
            }
        default:
            return state
    }
}
