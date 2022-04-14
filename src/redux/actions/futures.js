import Axios from 'axios'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import numeral from 'numeral'

import isNil from 'lodash/isNil'

import {
    API_GET_FUTURES_CONFIGS,
    API_SET_FUTURES_MARGIN_MODE,
    API_GET_FUTURES_MARKET_WATCH,
    API_GET_FUTURES_USER_SETTINGS,
    API_SET_FUTURES_POSITION_MODE,
    API_FUTURES_PLACE_ORDER,
    API_ORDER_TEST
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
import { log } from 'utils'
import showNotification from 'utils/notificationService'
import { roundToDown } from 'round-to'

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

export const placeFuturesOrder = async (params = {}, utils = {}) => {
    const validator = placeFuturesOrderValidator(params, utils)
    log.d('placeFuturesOrder Pre-processing...')
    const isValid = Object.values(validator)?.filter((e) => !e)

    if (isValid.length) {
        log.d(`placeFuturesOrder Pre-Process detect mistake `, validator)
        showNotification(
            {
                message: `TEST NOTI`,
                title: 'Error',
                type: 'failure',
            },
            1800,
            'bottom',
            'bottom-right'
        )

        return
    } else {
        log.d('placeFuturesOrder All params passed...', params)
        // return
    }
    // API_FUTURES_PLACE_ORDER
    console.log(params)
    try {
        const { data } = await Axios.post(API_ORDER_TEST, {
            ...params,
        })
        if (data?.status === ApiStatus.SUCCESS) {
            log.i('placeFuturesOrder result: ', data)
            showNotification(
                {
                    message: `Place Order Success`,
                    title: 'Success',
                    type: 'success',
                },
                1800,
                'bottom',
                'bottom-right'
            )
        } else {
            log.i('placeFuturesOrder result: ', data)
            showNotification(
                {
                    message: `${data?.message}`,
                    title: 'Error',
                    type: 'failure',
                },
                1800,
                'bottom',
                'bottom-right'
            )
        }
    } catch (e) {
        console.log(`Can't place order `, e)
    }
}

const placeFuturesOrderValidator = (params, utils) => {
    const _validator = {}

    const percentPrice =
        utils?.filters?.find((o) => o.filterType === 'PERCENT_PRICE') || {}

    const minNotional =
        utils?.filters?.find((o) => o.filterType === 'MIN_NOTIONAL') || {}

    // ? Check quantity is exist
    _validator.quantity = !!params?.quantity && params?.quantity > 0

    // ? Check Order's notional
    if (params?.quantity && params?.price && Object.keys(minNotional)?.length) {
        log.d(
            'Filter Orders notional ',
            'Quantity x Price: ',
            params?.quantity * params?.price,
            'Min Notional: ',
            +minNotional?.notional
        )
        _validator.ordersNotional =
            params?.quantity * params?.price >= +minNotional?.notional
    }

    // ? Check percent price
    if (params?.price && utils?.lastPrice) {
        const _percentPriceDiff = roundToDown(
            +(params?.price / utils?.lastPrice) || 0,
            +percentPrice?.multiplierDecimal || 2
        )
        log.d(
            'Filter Percent Price ',
            'Price - Last Price: ',
            _percentPriceDiff,
            `Is price diff between ${percentPrice?.multiplierDown} and ${percentPrice?.multiplierUp}`,
            _percentPriceDiff >= +percentPrice?.multiplierDown &&
                _percentPriceDiff <= +percentPrice?.multiplierUp
        )
        _validator.percentPrice =
            _percentPriceDiff >= +percentPrice?.multiplierDown &&
            _percentPriceDiff <= +percentPrice?.multiplierUp
    }

    log.d('Place Pre-Validator ', _validator)
    return _validator
}
