/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const initialState = {
    assetConfig: [],
    exchangeConfig: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_EXCHANGE_CONFIG:
            return { ...state, exchangeConfig: action.payload };
        case types.SET_ASSET_CONFIG:
            return { ...state, assetConfig: action.payload };

        default:
            return state;
    }
};
