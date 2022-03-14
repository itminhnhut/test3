import Axios from 'axios'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import numeral from 'numeral'

import { isNil } from 'lodash'
import {
    API_GET_FUTURES_CONFIGS,
    API_SET_FUTURES_MARGIN_MODE,
    API_GET_FUTURES_MARKET_WATCH,
    API_GET_FUTURES_USER_SETTINGS,
    API_SET_FUTURES_POSITION_MODE,
} from './apis'
import { ApiStatus, TRADING_MODE } from './const'
import {
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_USE_SLTP,
    GET_FUTURES_FAVORITE_PAIRS,
    SET_FUTURES_PAIR_CONFIGS,
    GET_FUTURES_MARKET_WATCH,
    GET_FUTURES_USER_SETTINGS,
} from './types'
import { favoriteAction } from './user'
import { FuturesMarginMode } from 'redux/reducers/futures'

export const setUsingSltp = (payload) => (dispatch) =>
    dispatch({
        type: SET_FUTURES_USE_SLTP,
        payload,
    })

export const setFuturesOrderTypes =
    (payload, isAdvance = false) =>
    (dispatch) => {
        dispatch({
            type: SET_FUTURES_ORDER_TYPES,
            payload,
        })
        isAdvance &&
            dispatch({
                type: SET_FUTURES_ORDER_ADVANCE_TYPES,
                payload,
            })
    }

export const getFuturesFavoritePairs = () => async (dispatch) => {
    const favoritePairs = await favoriteAction('get', TRADING_MODE.FUTURES)
    if (Array.isArray(favoritePairs) && favoritePairs.length) {
        dispatch({
            type: GET_FUTURES_FAVORITE_PAIRS,
            payload: favoritePairs,
        })
    }
}

export const getFuturesMarketWatch = () => async (dispatch) => {
    try {
        const { data } = await Axios.get(API_GET_FUTURES_MARKET_WATCH)
        if (data?.status === ApiStatus.SUCCESS) {
            // ? Futures MarketWatch
            const marketWatch = data?.data?.map((o) =>
                FuturesMarketWatch.create(o)
            )

            dispatch({
                type: GET_FUTURES_MARKET_WATCH,
                payload: marketWatch,
            })
        }
    } catch (e) {
        console.log(`Can't get Futures MarketWatch `, e)
    }
}

export const getFuturesConfigs = () => async (dispatch) => {
    try {
        const { data } = await Axios.get(API_GET_FUTURES_CONFIGS)

        if (data?.status === ApiStatus.SUCCESS) {
            dispatch({
                type: SET_FUTURES_PAIR_CONFIGS,
                payload: data?.data || [],
            })
        }
    } catch (e) {}
}

export const getFuturesUserSettings = () => async (dispatch) => {
    try {
        const { data } = await Axios.get(API_GET_FUTURES_USER_SETTINGS)
        if (data?.status === ApiStatus.SUCCESS) {
            dispatch({
                type: GET_FUTURES_USER_SETTINGS,
                payload: data?.data?.value,
            })
        }
    } catch (e) {
        console.log(`Can't get user settings `, e)
    }
}

export const setFuturesMarginMode = async (symbol, marginType) => {
    try {
        const { data } = await Axios.post(API_SET_FUTURES_MARGIN_MODE, {
            symbol,
            marginType,
        })
        if (data?.status === ApiStatus.SUCCESS) {
            return data?.data?.value?.marginType?.[symbol]
        }
    } catch (e) {
        console.log(`Can't set margin mode `, e)
        return false
    }
}

export const setFuturesPositionMode = async (dualSidePosition) => {
    try {
        const { data } = await Axios.post(API_SET_FUTURES_POSITION_MODE, {
            dualSidePosition,
        })
        if (data?.status === ApiStatus.SUCCESS) {
            return data?.data?.value?.dualSidePosition
        }
    } catch (e) {
        console.log(`Can't set margin mode `, e)
        return false
    }
}

export const mergeFuturesFavoritePairs = (favoritePairs, marketWatch) => {
    if (
        !marketWatch ||
        !marketWatch?.length ||
        !favoritePairs ||
        !favoritePairs?.length
    ) {
        return
    }
    const _favoritePairs = favoritePairs.map((o) => o.replace('_', ''))

    return marketWatch.filter((o) => _favoritePairs.includes(o?.symbol))
}

export const getMarginModeLabel = (mode) => {
    switch (mode) {
        case FuturesMarginMode.Cross:
            return 'Cross'
        case FuturesMarginMode.Isolated:
            return 'Isolated'
        default:
            return null
    }
}
