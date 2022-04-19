import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_FUTURES_PREFERENCES } from 'redux/actions/types';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import ToggleItem from './ToggleItem';

const FuturesPreferencesOrderConfirmation = () => {
    const preferences = useSelector(
        (state) => state.futures.preferences.orderConfirmation
    )

    const dispatch = useDispatch()

    const getLabel = (value) => {
        switch (value) {
            case FuturesOrderTypes.Limit:
                return 'Limit Order'
            case FuturesOrderTypes.Market:
                return 'Market Order'
            case FuturesOrderTypes.StopLimit:
                return 'Stop Limit Order'
            case FuturesOrderTypes.StopMarket:
                return 'Stop Market Order'
            case FuturesOrderTypes.TrailingStopMarket:
                return 'Trailing Stop Order'
            default:
                return null
        }
    }

    const setOrderConfirmPreferences = (field, status) => {
        if (preferences?.[field] !== status) {
            dispatch({
                type: SET_FUTURES_PREFERENCES,
                payload: {
                    orderConfirmation: { ...preferences, [field]: status },
                },
            })
        }
    }

    const renderPreferencesToggle = useCallback(
        () =>
            Object.values(FuturesOrderTypes)
                ?.filter(
                    (o) =>
                        o !== FuturesOrderTypes.TakeProfit &&
                        o !== FuturesOrderTypes.TakeProfitMarket
                )?
                .map((type) => (
                    <ToggleItem
                        key={type}
                        label={getLabel(type)}
                        active={!!preferences?.[type]}
                        className='mb-3'
                        onChange={() =>
                            setOrderConfirmPreferences(
                                type,
                                !preferences?.[type]
                            )
                        }
                    />
                )),
        [preferences]
    )

    return (
        <div>
            {renderPreferencesToggle()}
            <div className='mt-4 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                Order Confirmation will be required every time an order is submitted if this function is enabled. This setting only applies to USD-M-Futures
            </div>
        </div>
    )
}

export default FuturesPreferencesOrderConfirmation
