import { useSelector, useDispatch } from 'react-redux'
import { SET_FUTURES_PREFERENCES } from 'redux/actions/types'

import ToggleItem from './ToggleItem'

const NOTI = {
    TPSL: 'TPSL',
    FundingFee: 'FundingFee',
}

const FuturesPreferencesNotification = () => {
    const preferences = useSelector(
        (state) => state.futures.preferences?.notification
    )

    const dispatch = useDispatch()

    const setNotification = (field, status) => {
        if (preferences?.[field] !== status) {
            dispatch({
                type: SET_FUTURES_PREFERENCES,
                payload: {
                    notification: { ...preferences, [field]: status },
                },
            })
        }
    }

    return (
        <>
            <div className='mb-3'>
                <ToggleItem
                    label='TP/SL Trigger'
                    active={!!preferences?.[NOTI.TPSL]}
                    onChange={() =>
                        setNotification(NOTI.TPSL, !preferences?.[NOTI.TPSL])
                    }
                />
                <div className='mt-1 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    Notification limit is up to 25 per day per user. This
                    includes 5 order types. Take Profit/Stop Lost Limit, Take
                    Profit/Stop Loss Market, and Trailing Stop.
                </div>
            </div>
            <div>
                <ToggleItem
                    label='Funding Fee Trigger'
                    active={!!preferences?.[NOTI.FundingFee]}
                    onChange={() =>
                        setNotification(
                            NOTI.FundingFee,
                            !preferences?.[NOTI.FundingFee]
                        )
                    }
                />
                <div className='mt-1 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    You will be notified when expected funding rate charged
                    reaches.
                </div>
            </div>
            <div className='mt-4 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                You will be notifed of the following events via Email / SMS/
                Inmail. You can turn the notification on/off. This setting
                applies to both USD-M Futures and COIN-M Futures
            </div>
        </>
    )
}

export default FuturesPreferencesNotification
