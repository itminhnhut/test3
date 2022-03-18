import { memo, useCallback } from 'react'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { formatNumber } from 'redux/actions/utils'

import TradingLabel from 'components/trade/TradingLabel'
import min from 'lodash/min'

const FuturesOrderCostAndMax = memo(
    ({
        selectedAsset,
        pairConfig,
        price,
        markPrice,
        assumingPrice,
        initialMargin,
        currentType,
    }) => {
        const { t } = useTranslation()

        const renderCost = useCallback(() => {
            let longOrderOpenLoss = 0,
                shortOrderOpenLoss = 0

            const decimal = pairConfig?.pricePrecision
            const isMarket =
                currentType === FuturesOrderTypes.Market ||
                currentType === FuturesOrderTypes.StopMarket

            if (price && initialMargin && markPrice) {
                const priceDifference = markPrice - +price

                if (isMarket) {
                    longOrderOpenLoss =
                        0.2 * Math.abs(min([0, 1 * priceDifference])) +
                        initialMargin?.[0]
                    shortOrderOpenLoss =
                        0.2 * Math.abs(min([0, -1 * priceDifference])) +
                        initialMargin?.[1]
                } else {
                    longOrderOpenLoss =
                        1 * Math.abs(min([0, 1 * priceDifference])) +
                        initialMargin
                    shortOrderOpenLoss =
                        1 * Math.abs(min([0, -1 * priceDifference])) +
                        initialMargin
                }
            }

            // console.log([longOrderOpenLoss, shortOrderOpenLoss])

            return (
                <>
                    <TradingLabel
                        label={t('common:cost')}
                        value={`${formatNumber(longOrderOpenLoss, decimal)} ${
                            pairConfig?.quoteAsset
                        }`}
                        containerClassName='text-xs'
                    />
                    <TradingLabel
                        label={t('common:cost')}
                        value={`${formatNumber(shortOrderOpenLoss, decimal)} ${
                            pairConfig?.quoteAsset
                        }`}
                        containerClassName='text-xs'
                    />
                </>
            )
        }, [
            price,
            initialMargin,
            pairConfig?.pricePrecision,
            currentType,
            markPrice,
        ])

        return (
            <div className='mt-4 select-none'>
                <div className='flex items-center justify-between'>
                    {renderCost()}
                </div>
                <div className='mt-2 flex items-center justify-between'>
                    <TradingLabel
                        label={t('common:max')}
                        value={`100 ${selectedAsset}`}
                        containerClassName='text-xs'
                    />
                    <TradingLabel
                        label={t('common:max')}
                        value={`100 ${selectedAsset}`}
                        containerClassName='text-xs'
                    />
                </div>
            </div>
        )
    }
)

export default FuturesOrderCostAndMax
