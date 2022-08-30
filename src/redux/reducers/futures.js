import {
    SET_FUTURES_FAVORITE_PAIRS,
    SET_FUTURES_MARKET_WATCH,
    SET_OPEN_FUTURES_MARKET_WATCH,
    SET_FUTURES_USER_SETTINGS,
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_PAIR_CONFIGS,
    SET_FUTURES_PREFERENCES,
    SET_FUTURES_PRELOADED_FORM,
    SET_FUTURES_USE_SLTP,
    SET_FUTURES_ORDERS_LIST,
    SET_MULTI_FUTURES_MARKET_WATCH,
    GET_FUTURES_SETTING,
    SET_FUTURES_SETTING
} from 'redux/actions/types';
import FuturesMarketWatch from 'models/FuturesMarketWatch';

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

export const FuturesSettings = {
    order_confirm: 'show_place_order_confirm_modal',
    auto_type: 'auto_suggest_sl_tp'
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
    ordersList: [],
    settings: {}
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
        case SET_FUTURES_FAVORITE_PAIRS:
            return { ...state, favoritePairs: payload }
        case SET_FUTURES_MARKET_WATCH:
            return { ...state, marketWatch: payload }
        case SET_OPEN_FUTURES_MARKET_WATCH:
            return { ...state, openMarketWatch: payload }

        case SET_MULTI_FUTURES_MARKET_WATCH: {
            const data = payload || {};
            if (!state.marketWatch) {
                return state;
            }
            for (const pairKey in data) {
                if (data?.[pairKey] && data?.[pairKey]?.p) {
                    try {
                        data[pairKey] = FuturesMarketWatch.create(data[pairKey], 'VNDC')
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            const newMarketWatch = {...state.marketWatch, ...data}
            return { ...state, marketWatch: newMarketWatch }
        }
        case SET_FUTURES_USER_SETTINGS:
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
        case GET_FUTURES_SETTING:
            return {
                ...state,
                settings: payload,
            }
        case SET_FUTURES_SETTING:
            const _settings = { ...state.settings };
            if (_settings) {
                _settings?.user_setting = { ..._settings?.user_setting, ...payload?.setting }
            }
            return {
                ...state,
                settings: { ...state.settings, ..._settings },
            }
        default:
            return state
    }
}
