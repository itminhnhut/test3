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

export const getPartners = ({ params, cancelToken, getAll = true, callbackFn = () => {} }) => {
    return async (dispatch) => {
        const partnerType = {
            url: getAll ? API_GET_PARTNERS : API_GET_DEFAULT_PARTNER,
            actionType: getAll ? types.SET_PARTNERS : types.SET_DEFAULT_PARTNER
        };

        try {
            const data = await FetchApi({
                url: partnerType.url,
                params,
                ...(cancelToken ? { cancelToken } : {})
            });
            if (data && data.status === ApiStatus.SUCCESS) {
                dispatch({
                    type: partnerType.actionType,
                    payload: data.data
                });
            } else {
                dispatch({
                    type: partnerType.actionType,
                    payload: null
                });
            }
        } catch (error) {
            console.log(`GET ${partnerType.url} error:`, error);
        } finally {
            callbackFn();
        }
    };
};
