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
    accountBank: null,
    partnerBank: null,
    partner: null,
    modal: {
        isVisible: false,
        type: null,
        additionalData: null,
        confirmFunction: undefined,
        loading: false
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WITHDRAW_DEPOSIT_AMOUNT:
            return { ...state, input: action.payload };
        case types.SET_ASSET_ID:
            return { ...state, assetId: action.payload };
        case types.TOGGLE_MODAL:
            const newModalState = action.payload;
            return {
                ...state,
                modal: {
                    ...state.modal,
                    ...newModalState
                }
            };
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
