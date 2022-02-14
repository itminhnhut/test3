import { SET_FUTURES_ORDER_TYPES } from 'redux/actions/types'

export const FuturesOrderTypes = {
    Limit: 'LIMIT',
    Market: 'MARKET',
    StopLimit: 'STOP',
}

export const initialState = {
    orderType: FuturesOrderTypes.Limit,
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case SET_FUTURES_ORDER_TYPES:
            return { ...state, orderType: payload }
        default:
            return state
    }
}
