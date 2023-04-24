/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const SIDE = {
    BUY: 'BUY',
    SELL: 'SELL'
};

export const initialState = {
    input: '',
    accountBank: null,
    partnerBank: null,
    partner: null,
    loadingPartner: false,
    minimumAllowed: 0,
    maximumAllowed: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WITHDRAW_DEPOSIT_AMOUNT:
            return { ...state, input: action.payload };
        case types.SET_ALLOWED_AMOUNT:
            return { ...state, minimumAllowed: action.payload.min, maximumAllowed: action.payload.max };
        case types.SET_LOADING_PARTNER:
            return { ...state, loadingPartner: action.payload };

        case types.SET_ACCOUNT_BANK:
            return {
                ...state,
                accountBank: action.payload
            };
        case types.SET_PARTNER:
            return {
                ...state,
                partner: action.payload,
                partnerBank: action.payload?.defaultBank
            };
        case types.SET_PARTNER_BANK:
            return {
                ...state,
                partnerBank: action.payload
            };

        default:
            return state;
    }
};
