import axios from 'axios';
import { API_GET_PAYMENT_CONFIG } from './apis';
import { SET_PAYMENT_CONFIG } from './types';
import { ApiStatus } from './const';

export function getPaymentConfigs() {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(API_GET_PAYMENT_CONFIG);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                // Khi nạp rút, những token có network và trim() tên coin trong network đó ra String thì available
                const payload = Object.values(data.data)
                    .filter((o) => o.networkList.length > 0 && o?.networkList?.[0]?.coin?.trim())
                    .map((o) => ({
                        ...o,
                        assetCode: o?.networkList?.[0]?.coin
                    }));

                dispatch({
                    type: SET_PAYMENT_CONFIG,
                    payload
                });
            }
        } catch (e) {
            console.log(`Can't get payment configs `, e);
        }
    };
}
