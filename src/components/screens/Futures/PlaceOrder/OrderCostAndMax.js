import { memo, useCallback, useEffect, useState } from 'react'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { formatNumber } from 'redux/actions/utils'
import { useSelector } from 'react-redux'

import TradingLabel from 'components/trade/TradingLabel'
import min from 'lodash/min'
import max from 'lodash/max'

const FuturesOrderCostAndMax = ({
    selectedAsset,
    pairConfig,
    price,
    markPrice,
    lastPrice,
    assumingPrice,
    currentType,
    size,
    leverage,
    isAssetReversed,
    availableAsset,
}) => {
    const [shortOrderOpenLoss, setShortOrderOpenLoss] = useState(0)
    const [longOrderOpenLoss, setLongOrderOpenLoss] = useState(0)
    const [initialMargin, setInitialMargin] = useState(0)

    const { t } = useTranslation()

    const decimal = pairConfig?.pricePrecision || 2
    const isMarket =
        currentType === FuturesOrderTypes.Market ||
        currentType === FuturesOrderTypes.StopMarket

    const renderCost = () => {
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
    }

    const renderMax = () => {
        let shortPlaceMax = 0,
            longPlaceMax = 0
        const _size = isAssetReversed ? size / lastPrice : size

        shortPlaceMax = (availableAsset * _size) / shortOrderOpenLoss
        longPlaceMax = (availableAsset * _size) / longOrderOpenLoss

        return (
            <>
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        shortPlaceMax,
                        decimal
                    )} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        longPlaceMax,
                        decimal
                    )} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
            </>
        )
    }

    useEffect(() => {
        // Limit initial margin
        if ([OrderTypes.Limit, OrderTypes.StopLimit].includes(currentType)) {
            if (price && size && leverage) {
                const _size = isAssetReversed ? +size / lastPrice : +size
                setInitialMargin((+price * _size) / leverage)
            } else {
                setInitialMargin(0)
            }
        }

        // ? Market initial margin
        if ([OrderTypes.Market, OrderTypes.StopMarket].includes(currentType)) {
            if (assumingPrice && price && size && leverage) {
                setInitialMargin([
                    (assumingPrice?.ask * (1 + 0.0005) * 0.2) / leverage,
                    (max([assumingPrice?.bid, markPrice]) * 0.2) / leverage,
                ])
            } else {
                setInitialMargin(0)
            }
        }
    }, [
        currentType,
        markPrice,
        assumingPrice,
        leverage,
        size,
        price,
        isAssetReversed,
        lastPrice,
    ])

    useEffect(() => {
        if (price && initialMargin && markPrice) {
            const priceDifference = markPrice - +price

            if (isMarket) {
                setLongOrderOpenLoss(
                    0.2 * Math.abs(min([0, 1 * priceDifference])) +
                        initialMargin?.[0]
                )

                setShortOrderOpenLoss(
                    0.2 * Math.abs(min([0, -1 * priceDifference])) +
                        initialMargin?.[1]
                )
            } else {
                setLongOrderOpenLoss(
                    1 * Math.abs(min([0, 1 * priceDifference])) + initialMargin
                )

                setShortOrderOpenLoss(
                    1 * Math.abs(min([0, -1 * priceDifference])) + initialMargin
                )
            }
        } else {
            setLongOrderOpenLoss(0)
            setShortOrderOpenLoss(0)
        }
    }, [price, initialMargin, markPrice])

    return (
        <div className='mt-4 select-none'>
            <div className='flex items-center justify-between'>
                {renderCost()}
            </div>
            <div className='mt-2 flex items-center justify-between'>
                {renderMax()}
            </div>
        </div>
    )
}

export default FuturesOrderCostAndMax
