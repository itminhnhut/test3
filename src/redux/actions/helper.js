import Axios from 'axios';

import { API_WITHDRAW_V4 } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';

export const withdrawHelper = async (assetId, _amount, network, _withdrawTo, tag, otp) => {
    const withdrawTo = _withdrawTo.trim();
    const amount = +_amount;

    try {
        const { data } = await Axios.post(API_WITHDRAW_V4, {
            assetId,
            amount,
            network,
            withdrawTo,
            tag,
            otp
        });
        return data;
    } catch (err) {
        return {
            status: ApiStatus.ERROR,
            data: null
        };
    }
};

export const WITHDRAW_RESULT = {
    INVALID_ADDRESS: 'invalid_address',
    INVALID_AMOUNT: 'invalid_amount',
    INVALID_CURRENCY: 'invalid_currency',
    INSUFFICIENT: 'insufficient',
    NOT_REACHED_MIN_WITHDRAW_IN_USD: 'not_reached_min_withdraw_in_usd',
    NOT_ENOUGH_FEE: 'not_enough_fee',
    MEMO_TOO_LONG: 'memo_too_long',
    AMOUNT_EXCEEDED: 'invalid_max_amount',
    TOO_MUCH_REQUEST: 'TOO_MUCH_REQUEST',
    SECRET_INVALID: 'SECRET_INVALID',
    // invalid_smart_otp: 'invalid_smart_otp',

    INVALID_KYC_STATUS: 'invalid_kyc_status',
    InvalidUser: 'invalid_user',
    InvalidAsset: 'invalid_asset',
    WithdrawDisabled: 'withdraw_disabled',
    UnsupportedAddress: 'unsupported_address',
    InvalidAddress: 'invalid_address',
    AmountTooSmall: 'amount_too_small',
    AmountExceeded: 'amount_exceeded',
    NotEnoughBalance: 'not_enough_balance',
    MissingOtp: 'missing_otp',
    InvalidOtp: 'invalid_otp',
    SOTP_INVALID: 'SOTP_INVALID',
    Unknown: 'unknown_error',
    EXCEEDED_SMART_OTP: 'SOTP_INVALID_EXCEED_TIME'
};
