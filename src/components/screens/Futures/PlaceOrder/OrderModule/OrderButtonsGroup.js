import { useCallback, useEffect } from 'react'
import { placeFuturesOrder } from 'redux/actions/futures'
import { useTranslation } from 'next-i18next'
import { FuturesOrderTypes } from 'redux/reducers/futures'

const FuturesOrderButtonsGroup = ({
    symbol,
    type,
    positionMode,
    quantity,
    price,
    stopPrice,
}) => {
    const { t } = useTranslation()

    const handleParams = useCallback(
        (side) => {
            const params = {
                symbol,
                type,
                side,
                quantity,
            }

            positionMode
                ? (params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT')
                : delete params.positionSide

            switch (type) {
                case FuturesOrderTypes.Limit:
                    params.price = price
                    break
                case FuturesOrderTypes.StopLimit:
                    params.price = price
                    params.stopPrice = stopPrice
                    break
                case FuturesOrderTypes.StopMarket:
                    params.stopPrice = stopPrice
                    break
            }

            return params
        },
        [symbol, type, positionMode, quantity, price, stopPrice]
    )

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div
                className='w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() => placeFuturesOrder(handleParams('BUY'))}
            >
                {t('common:buy')}/Long
            </div>
            <div
                className='w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() => placeFuturesOrder(handleParams('SELL'))}
            >
                {t('common:sell')}/Short
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroup
