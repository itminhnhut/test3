import * as types from './types';
import { SIDE } from '../reducers/withdrawDeposit';
import axios from 'axios';
import { API_GET_DEFAULT_PARTNER, API_GET_PARTNERS } from './apis';
import { ApiStatus } from './const';
import FetchApi from 'utils/fetch-api';

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
            const [partners, partner] = await Promise.allSettled([
                axios.get(API_GET_PARTNERS, {
                    params,
                    ...(cancelToken ? { cancelToken } : {})
                }),
                axios.get(API_GET_DEFAULT_PARTNER, {
                    params,
                    ...(cancelToken ? { cancelToken } : {})
                })
            ]);

            dispatch({
                type: types.SET_PARTNER,
                payload: parseDataFromPromiseSettled(partner)
            });
        } catch (error) {
            console.log(`GET ${API_GET_PARTNERS} error:`, error);
        } finally {
            callbackFn();
        }
    };
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
