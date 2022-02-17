import Axios from 'axios'
import { API_GET_FUTURES_CONFIGS, API_GET_FUTURES_MARKET_WATCH } from './apis'

import { ApiStatus, TRADING_MODE } from './const'
import {
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_USE_SLTP,
    GET_FUTURES_FAVORITE_PAIRS,
    SET_FUTURES_PAIR_CONFIGS,
} from './types'
import { favoriteAction } from './user'

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

// export const getFuturesMarketWatch = () => async (dispatch) => {
//     try {
//         const { data } = await Axios.get(API_GET_FUTURES_MARKET_WATCH)
//         console.log('futures market watch', data)
//     } catch (e) {}
// }

export const getFuturesConfigs = () => async (dispatch) => {
    try {
        const { data } = await Axios.get(API_GET_FUTURES_CONFIGS)

        if (data?.status === ApiStatus.SUCCESS) {
            const favoritePairs = await favoriteAction(
                'get',
                TRADING_MODE.FUTURES
            )
            if (Array.isArray(favoritePairs) && favoritePairs.length) {
                const _favoritePairs = favoritePairs?.map((o) =>
                    o.replace('_', '')
                )
                const favoritePairsPayload = data?.data?.filter((o) =>
                    _favoritePairs?.includes(o?.pair)
                )
                // console.log('Check Fav ', favoritePairsPayload)
                if (
                    Array.isArray(favoritePairsPayload) &&
                    favoritePairsPayload.length
                ) {
                    dispatch({
                        type: GET_FUTURES_FAVORITE_PAIRS,
                        payload: favoritePairsPayload,
                    })
                }
            }

            dispatch({
                type: SET_FUTURES_PAIR_CONFIGS,
                payload: data?.data || [],
            })
        }
    } catch (e) {}
}
