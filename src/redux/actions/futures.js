import {
    SET_FUTURES_ORDER_ADVANCE_TYPES,
    SET_FUTURES_ORDER_TYPES,
    SET_FUTURES_USE_SLTP,
} from './types'

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
