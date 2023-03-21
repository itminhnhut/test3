import * as types from './types';
import { SIDE } from '../reducers/withdrawDeposit';
import { API_CREATE_ORDER, API_GET_DEFAULT_PARTNER, API_GET_PARTNERS } from './apis';
import { ApiStatus } from './const';
import FetchApi from 'utils/fetch-api';
import Axios from 'axios';

export const setInput = (value) => {
    return (dispatch) => {
        dispatch({ type: types.SET_WITHDRAW_DEPOSIT_AMOUNT, payload: value });
    };
};

export const switchAsset = (currentAssetId) => {
    return (dispatch) => {
        dispatch({ type: types.SET_ASSET_ID, payload: currentAssetId === 72 ? 22 : 72 });
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

export const getPartners = ({ params, cancelToken, callbackFn = () => {} }) => {
    return async (dispatch) => {
        try {
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

export const createNewOrder = async ({ assetId, bankAccountId, partnerId, quantity, side }) => {
    const res = await Axios.post(API_CREATE_ORDER, {
        assetId,
        bankAccountId,
        partnerId,
        quantity,
        side
    });

    return res.data;
};

const parseDataFromPromiseSettled = (response) => {
    if (response.status === 'fulfilled') {
        const { data } = response.value;
        if (data && data.status === ApiStatus.SUCCESS) {
            return data.data;
        }
    }
    return null;
};
