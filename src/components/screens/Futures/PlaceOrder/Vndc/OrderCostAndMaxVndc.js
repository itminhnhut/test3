import { memo, useCallback, useEffect, useState } from 'react'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { formatNumber } from 'redux/actions/utils'
import { useSelector } from 'react-redux'

import TradingLabel from 'components/trade/TradingLabel'
import min from 'lodash/min'
import max from 'lodash/max'
import Link from 'next/link';

const FuturesOrderCostAndMaxVndc = ({
    selectedAsset,
    pairConfig,
    price,
    assumingPrice,
    currentType,
    quantity,
    size,
    leverage,
    isAssetReversed,
    availableAsset,
    maxBuy,
    maxSell,
    ask,
    bid,
    stopPrice
}) => {
    const [shortOrderOpenLoss, setShortOrderOpenLoss] = useState(0)
    const [longOrderOpenLoss, setLongOrderOpenLoss] = useState(0)

    const { t } = useTranslation()

    const isMarket =
        currentType === FuturesOrderTypes.Market ||
        currentType === FuturesOrderTypes.StopMarket

    const renderCost = () => {
        return (
            <>
                <TradingLabel
                    label={t('common:cost')}
                    value={`${formatNumber(
                        longOrderOpenLoss,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t('common:cost')}
                    value={`${formatNumber(
                        shortOrderOpenLoss,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-xs'
                />
            </>
        )
    }

    const renderMax = () => {
        return (
            <>
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        maxBuy,
                        pairConfig?.quantityPrecision
                    )} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        maxSell,
                        pairConfig?.quantityPrecision
                    )} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
            </>
        )
    }

    useEffect(() => {
        // Limit initial margin
        const _size = isNaN(size) ? Number(size.substring(0, size.indexOf('%'))) / 100 : size;
        if (leverage) {
            let costBuy = 0;
            let costSell = 0;
            if ([OrderTypes.Limit, OrderTypes.StopMarket].includes(currentType)) {
                const _price = currentType === OrderTypes.Limit ? price : stopPrice;
                const notional = +_price * _size;
                const fee = notional * (0.1 / 100);
                costBuy = (notional / leverage) + fee;
                costSell = costBuy;
            } else if ([OrderTypes.Market].includes(currentType)) {
                costBuy = ((ask * _size) / leverage) + (_size * ask * (0.1 / 100));
                costSell = ((bid * _size) / leverage) + (_size * bid * (0.1 / 100));;
            }
            setShortOrderOpenLoss(costBuy)
            setLongOrderOpenLoss(costSell)
        } else {
            setShortOrderOpenLoss(0)
            setLongOrderOpenLoss(0)
        }
    }, [
        currentType,
        assumingPrice,
        leverage,
        quantity,
        size,
        price,
        isAssetReversed,
        ask,
        bid
    ])

    return (
        <div className='mt-4 select-none'>
            <div className='flex items-center justify-between'>
                {renderCost()}
            </div>
            <div className='mt-2 flex items-center justify-between'>
                {renderMax()}
            </div>
            <Link href={'https://nami.exchange/fee-schedule/trading'}>
                <a target='_blank'>
                    <div className="text-teal underline cursor-pointer float-right mt-[8px] font-medium">{t('futures:fee_level')}</div>
                </a>
            </Link>
        </div>
    )
}

export default FuturesOrderCostAndMaxVndc
