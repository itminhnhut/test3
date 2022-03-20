import Axios from 'axios'

import { API_WITHDRAW_v3 } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'

export const withdrawHelper = async (
    assetId,
    _amount,
    network,
    _withdrawTo,
    tag,
    otp
) => {
    const withdrawTo = _withdrawTo.trim()
    const amount = +_amount

    try {
        const { data } = await Axios.post(API_WITHDRAW_v3, {
            assetId,
            amount,
            network,
            withdrawTo,
            tag,
            otp,
        })
        if (data) {
            return {
                status: ApiStatus.SUCCESS,
                data: data,
            }
        }

        return {
            status: ApiStatus.ERROR,
            data: null,
        }
    } catch (err) {
        return {
            status: ApiStatus.ERROR,
            data: null,
        }
    }
}

export const WITHDRAW_RESULT = {
    INVALID_ADDRESS: 'invalid_address',
    INVALID_AMOUNT: 'invalid_amount',
    INVALID_CURRENCY: 'invalid_currency',
    INSUFFICIENT: 'insufficient',
    NOT_REACHED_MIN_WITHDRAW_IN_USD: 'not_reached_min_withdraw_in_usd',
    NOT_ENOUGH_FEE: 'not_enough_fee',
    MEMO_TOO_LONG: 'memo_too_long',
    INVALID_OTP: 'invalid_otp',
    MISSING_OTP: 'missing_otp',
    AMOUNT_EXCEEDED: 'invalid_max_amount',
    UNKNOWN_ERROR: 'unknown_error',
    INVALID_KYC_STATUS: 'invalid_kyc_status',
}
