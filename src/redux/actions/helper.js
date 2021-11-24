import Axios from 'axios'

import { API_WITHDRAW } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'

export const withdrawHelper = async (_address, _amount, currency, otp, memo, tokenTypeIndex, networkType) => {
    const address = _address.trim()
    const amount = +_amount

    try {
        const { data } = await Axios.post(API_WITHDRAW,
            {
                address,
                amount,
                currency,
                otp,
                memo,
                tokenTypeIndex,
                networkType
            })
        if (data) {
            return {
                status: ApiStatus.SUCCESS,
                data: data
            }
        }

        return {
            status: ApiStatus.ERROR,
            data: null
        }
    } catch (err) {
        return {
            status: ApiStatus.ERROR,
            data: null
        }
    }
}
