/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const SIDE = {
    BUY: 'BUY',
    SELL: 'SELL'
};

export const initialState = {
    input: '',
    assetId: 72,
    assetInfo: null,
    partners: [],
    selectedPartner: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WITHDRAW_DEPOSIT_AMOUNT:
            return { ...state, input: action.payload };
        case types.SET_ASSET_ID:
            return { ...state, assetId: action.payload };

        case types.SET_PARTNERS:
            return {
                ...state,
                partners: action.payload || []
            };
        case types.SET_DEFAULT_PARTNER:
            return {
                ...state,
                selectedPartner: action.payload
            };
        default:
            return state;
    }
};
