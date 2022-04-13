import { useCallback, useEffect } from 'react'
import { placeFuturesOrder } from 'redux/actions/futures'
import { useTranslation } from 'next-i18next'
import { FuturesOrderTypes } from 'redux/reducers/futures'

const FuturesOrderButtonsGroup = ({
    pairConfig,
    type,
    positionMode,
    quantity,
    price,
    stopPrice,
    lastPrice,
    currentType,
    stopOrderMode,
}) => {
    const { t } = useTranslation()

    const handleParams = useCallback(
        (side) => {
            const params = {
                symbol: pairConfig?.symbol,
                type,
                side,
                quantity: side === 'BUY' ? +quantity?.buy : +quantity?.sell,
            }

            positionMode
                ? (params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT')
                : delete params.positionSide

            switch (type) {
                case FuturesOrderTypes.Limit:
                    params.price = +price
                    break
                case FuturesOrderTypes.StopLimit:
                    params.price = +price
                    params.stopPrice = +stopPrice
                    params.workingType = stopOrderMode
                    break
                case FuturesOrderTypes.StopMarket:
                    params.stopPrice = +stopPrice
                    params.workingType = stopOrderMode
                    break
            }

            return params
        },
        [
            pairConfig?.symbol,
            type,
            positionMode,
            quantity,
            price,
            stopPrice,
            stopOrderMode,
        ]
    )

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div
                className='w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    placeFuturesOrder(handleParams('BUY'), {
                        filters: pairConfig?.filters,
                        lastPrice,
                        isMarket: [
                            FuturesOrderTypes.Market,
                            FuturesOrderTypes.StopMarket,
                        ].includes(currentType),
                    })
                }
            >
                {t('common:buy')}/Long
            </div>
            <div
                className='w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    placeFuturesOrder(handleParams('SELL'), {
                        filters: pairConfig?.filters,
                        lastPrice,
                        isMarket: [
                            FuturesOrderTypes.Market,
                            FuturesOrderTypes.StopMarket,
                        ].includes(currentType),
                    })
                }
            >
                {t('common:sell')}/Short
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroup
