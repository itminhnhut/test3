import {
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_USE_SLTP,
    GET_FUTURES_FAVORITE_PAIRS,
    SET_FUTURES_PAIR_CONFIGS,
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

export const initialState = {
    pairConfig: [],
    orderType: FuturesOrderTypes.Limit,
    orderAdvanceType: FuturesOrderTypes.StopLimit,
    useSltp: false,
    favoritePairs: [],
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case SET_FUTURES_PAIR_CONFIGS:
            return { ...state, pairConfig: payload }
        case SET_FUTURES_ORDER_TYPES:
            return { ...state, orderType: payload }
        case SET_FUTURES_ORDER_ADVANCE_TYPES:
            return { ...state, orderAdvanceType: payload }
        case SET_FUTURES_USE_SLTP:
            return { ...state, useSltp: payload }
        case GET_FUTURES_FAVORITE_PAIRS:
            return { ...state, favoritePairs: payload }
        default:
            return state
    }
}
