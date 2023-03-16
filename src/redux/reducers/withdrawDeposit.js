/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const initialState = {
    input: '',
    currency: 72,
    currencyInfo: null,
    partners: [],
    selectedPartner: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WITHDRAW_DEPOSIT_AMOUNT: 
            return { ...state, input: action.payload };
        default:
            return state;
    }
};
