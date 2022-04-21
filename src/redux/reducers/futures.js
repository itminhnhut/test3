import {
    GET_FUTURES_FAVORITE_PAIRS,
    GET_FUTURES_MARKET_WATCH,
    GET_FUTURES_USER_SETTINGS,
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_PAIR_CONFIGS,
    SET_FUTURES_PREFERENCES,
    SET_FUTURES_PRELOADED_FORM,
    SET_FUTURES_USE_SLTP,
    SET_FUTURES_ORDERS_LIST
} from 'redux/actions/types';

export const FuturesOrderTypes = {
    Limit: 'LIMIT',
    Market: 'MARKET',
    StopLimit: 'STOP',
    StopMarket: 'STOP_MARKET',
    TakeProfit: 'TAKE_PROFIT',
    TakeProfitMarket: 'TAKE_PROFIT_MARKET',
    TrailingStopMarket: 'TRAILING_STOP_MARKET',
}

export const FuturesStopOrderMode = {
    markPrice: 'MARK_PRICE',
    lastPrice: 'CONTRACT_PRICE',
}

export const FuturesMarginMode = {
    Isolated: 'ISOLATED',
    Cross: 'CROSSED',
}

export const FuturesPositionMode = {
    OneWay: 'OneWay',
    Hedge: 'Hedge',
}

export const initialState = {
    pairConfigs: [],
    orderType: FuturesOrderTypes.Limit,
    orderAdvanceType: FuturesOrderTypes.StopLimit,
    useSltp: false,
    favoritePairs: [],
    marketWatch: [],
    userSettings: {},

    preloadedState: {
        orderType: FuturesOrderTypes.Limit,
        orderAdvanceType: FuturesOrderTypes.StopLimit,
        useSltp: false,
    },
    preferences: {
        orderConfirmation: {},
        positionMode: {},
        notification: {},
    },
    ordersList: []
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
        case GET_FUTURES_USER_SETTINGS:
            return { ...state, userSettings: payload }
        case SET_FUTURES_PRELOADED_FORM:
            return {
                ...state,
                preloadedState: { ...state.preloadedState, ...payload },
            }
        case SET_FUTURES_PREFERENCES:
            return {
                ...state,
                preferences: { ...state.preferences, ...payload },
            }
        case SET_FUTURES_ORDERS_LIST:
            return {
                ...state,
                ordersList: payload,
            }
        default:
            return state
    }
}
