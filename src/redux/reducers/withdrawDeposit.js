/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

// import { MODAL_TYPE } from 'components/screens/WithdrawDeposit/constants';
import * as types from '../actions/types';
export const MODAL_TYPE = {
    CONFIRM: 'confirm',
    AFTER_CONFIRM: 'afterConfirm'
};
export const SIDE = {
    BUY: 'BUY',
    SELL: 'SELL'
};

const INITIAL_MODAL_STATE = {
    [MODAL_TYPE.CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null },
    [MODAL_TYPE.AFTER_CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null }
};

export const initialState = {
    input: '',
    accountBank: null,
    partnerBank: null,
    partner: null,
    loadingPartner: false,
    minimumAllowed: 0,
    maximumAllowed: 0,
    modal: INITIAL_MODAL_STATE
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
        case types.SET_PARTNER_MODAL:
            return {
                ...state,
                modal: {
                    ...state.modal,
                    [action.payload.key]: {
                        ...state.modal[action.payload.key],
                        ...action.payload.state
                    }
                }
            };
        case types.RESET_PARTNER_MODAL:
            return {
                ...state,
                modal: INITIAL_MODAL_STATE
            };
        default:
            return state;
    }
};
