import * as types from './types';
import {
    API_PROCESS_ORDER,
    API_APPROVE_PARTNER_ORDER,
    API_CREATE_ORDER,
    API_CREATE_ORDER_WITH_OTP,
    API_GET_DEFAULT_PARTNER,
    API_GET_PARTNERS,
    API_GET_PARTNER_PROFILE,
    API_MARK_PARTNER_ORDER,
    API_RATING_ORDER,
    API_REJECT_PARTNER_ORDER,
    API_SET_PARTNER_ORDER_CONFIG,
    API_SET_USER_BANK_ACCOUNT,
    API_RESOLVE_PARTNER_ORDER
} from './apis';
import { ApiStatus } from './const';
import FetchApi from 'utils/fetch-api';
import Axios from 'axios';

export const setInput = (value) => {
    return (dispatch) => {
        dispatch({ type: types.SET_WITHDRAW_DEPOSIT_AMOUNT, payload: value });
    };
};

export const setPartnerBank = (bank) => {
    return (dispatch) => {
        dispatch({ type: types.SET_PARTNER_BANK, payload: bank });
    };
};

export const setPartnerModal = ({ key, state }) => {
    return (dispatch) => {
        dispatch({
            type: types.SET_PARTNER_MODAL,
            payload: {
                key,
                state
            }
        });
    };
};

export const resetPartnerModal = () => {
    return (dispatch) => {
        dispatch({
            type: types.RESET_PARTNER_MODAL
        });
    };
};

export const setPartner = (partner) => {
    return (dispatch) => {
        dispatch({ type: types.SET_PARTNER, payload: partner });
    };
};

export const setAccountBank = (defaultAccountBank) => (dispatch) => dispatch({ type: types.SET_ACCOUNT_BANK, payload: defaultAccountBank });
export const setAllowedAmount = (payload) => (dispatch) => {
    return dispatch({
        type: types.SET_ALLOWED_AMOUNT,
        payload
    });
};

export const setLoadingPartner = (payload) => (dispatch) => dispatch({ type: types.SET_LOADING_PARTNER, payload });

export const getPartner = ({ params, cancelToken, callbackFn = () => {} }) => {
    return async (dispatch) => {
        try {
            dispatch(setLoadingPartner(true));
            const partner = await FetchApi({
                url: API_GET_DEFAULT_PARTNER,
                params,
                ...(cancelToken ? { cancelToken } : {})
            });
            if (partner && partner.status === ApiStatus.SUCCESS) {
                dispatch({
                    type: types.SET_PARTNER,
                    payload: partner.data
                });
            } else {
                dispatch({
                    type: types.SET_PARTNER,
                    payload: null
                });
            }
        } catch (error) {
            console.log(`GET ${API_GET_DEFAULT_PARTNER} error:`, error);
        } finally {
            callbackFn();
        }
    };
};

export const createNewOrder = async ({ assetId, bankAccountId, partnerId, quantity, side, otp }) => {
    const res = await Axios.post(API_CREATE_ORDER, { assetId: +assetId, bankAccountId, partnerId, quantity: +quantity, side, otp });
    return res.data;
};

export const setAccountDefaultBank = async ({ bankAccountId }) => {
    const res = await Axios.post(API_SET_USER_BANK_ACCOUNT, {
        bankAccountId
    });

    return res.data;
};

export const markOrder = async ({ displayingId, userStatus, mode = 'user' }) => {
    const res = await Axios.post(API_MARK_PARTNER_ORDER, {
        displayingId,
        userStatus,
        mode
    });

    return res.data;
};

export const approveOrder = async ({ displayingId, mode = 'user' }) => {
    const res = await Axios.post(API_APPROVE_PARTNER_ORDER, {
        displayingId,
        mode
    });

    return res.data;
};

export const rejectOrder = async ({ displayingId, mode = 'user' }) => {
    const res = await Axios.post(API_REJECT_PARTNER_ORDER, {
        displayingId,
        mode
    });

    return res.data;
};

export const resolveDispute = async ({ displayingId, mode = 'user' }) => {
    const res = await Axios.post(API_RESOLVE_PARTNER_ORDER, {
        displayingId,
        mode
    });

    return res.data;
};

export const ratingOrder = async ({ displayingId, rating }) => {
    const res = await Axios.post(API_RATING_ORDER, {
        displayingId,
        rating
    });

    return res.data;
};

export const editPartnerConfig = async ({ side, min, max, status }) => {
    const res = await Axios.post(API_SET_PARTNER_ORDER_CONFIG, {
        side,
        min,
        max,
        status,
        assetId: 72
    });

    return res.data;
};

export const processPartnerOrder = async ({ displayingId, status }) => {
    const res = await Axios.post(API_PROCESS_ORDER, {
        displayingId,
        status
    });

    return res.data;
};
