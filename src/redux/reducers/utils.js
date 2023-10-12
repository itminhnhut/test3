/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';
import { SET_TIME_SYNC, SET_TIME_SYNC_OFFSET } from '../actions/types';

export const initialState = {
    assetConfig: [],
    exchangeConfig: [],
    transferModal: false,
    usdRate: null,
    bottomNav: null,
    timesync: null,
    timeOffset: null, // Thoi gian chenh lech giua server vs client ( = server time - client time)

}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_EXCHANGE_CONFIG:
            return { ...state, exchangeConfig: action.payload }
        case types.SET_ASSET_CONFIG:
            return { ...state, assetConfig: action.payload }
        case types.SET_TRANSFER_MODAL:
            return { ...state, transferModal: action.payload }
        case types.SET_USD_RATE:
            return { ...state, usdRate: action.payload }
        case types.SET_BOTTOM_NAVIGATION:
            return {
                ...state,
                bottomNav: action.payload,
            }
        case SET_TIME_SYNC:
            return {...state, timesync: action.payload}
        case SET_TIME_SYNC_OFFSET:
            return {...state, timeOffset: action.payload}
        default:
            return state
    }
}
