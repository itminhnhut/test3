import * as types from './types';
import {
    API_CREATE_ORDER,
    API_CREATE_ORDER_WITH_OTP,
    API_GET_DEFAULT_PARTNER,
    API_GET_PARTNERS,
    API_MARK_PARTNER_ORDER,
    API_REJECT_PARTNER_ORDER,
    API_SET_USER_BANK_ACCOUNT
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

export const setPartner = (partner) => {
    return (dispatch) => {
        dispatch({ type: types.SET_PARTNER, payload: partner });
    };
};

export const setAccountBank = (defaultAccountBank) => (dispatch) => dispatch({ type: types.SET_ACCOUNT_BANK, payload: defaultAccountBank });

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

export const rejectOrder = async ({ displayingId, mode = 'user' }) => {
    const res = await Axios.post(API_REJECT_PARTNER_ORDER, {
        displayingId,
        mode
    });

    return res.data;
};
