import * as types from './types';

export const setInput = (value) => {
    return (dispatch) => {
        dispatch({ type: types.SET_WITHDRAW_DEPOSIT_AMOUNT, payload: value });
    };
};
