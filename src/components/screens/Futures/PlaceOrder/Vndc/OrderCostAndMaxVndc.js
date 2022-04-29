import { useEffect, useState } from 'react';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';

import TradingLabel from 'components/trade/TradingLabel';
import Link from 'next/link';
import ChevronDown from 'src/components/svg/ChevronDown';
import { useSelector } from 'react-redux';

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
    stopPrice,
}) => {
    const [shortOrderOpenLoss, setShortOrderOpenLoss] = useState(0)
    const [longOrderOpenLoss, setLongOrderOpenLoss] = useState(0)
    const vip = useSelector((state => state?.user?.vip))
    const { t } = useTranslation()

    const isMarket =
        currentType === FuturesOrderTypes.Market ||
        currentType === FuturesOrderTypes.StopMarket

    const renderCost = () => {
        return (
            <>
                <TradingLabel
                    label={t('futures:margin')}
                    value={`${formatNumber(
                        longOrderOpenLoss,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-md'
                />
                <TradingLabel
                    label={t('futures:margin')}
                    value={`${formatNumber(
                        shortOrderOpenLoss,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-md'
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
                    containerClassName='text-md'
                />
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        maxSell,
                        pairConfig?.quantityPrecision
                    )} ${selectedAsset}`}
                    containerClassName='text-md'
                />
            </>
        )
    }

    useEffect(() => {
        // Limit initial margin
        const _size = isNaN(size) ? quantity?.buy : size;
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
        bid,
        stopPrice
    ])

    return (
        <div className='mt-4 select-none'>
            <div className='flex items-center justify-between'>
                {renderCost()}
            </div>
            <div className='mt-2 flex items-center justify-between'>
                {renderMax()}
            </div>

            <div className="float-right mt-[8px] group relative">
                <div className="text-teal underline cursor-pointer font-medium ">{t('futures:fee_tier')}</div>
                <div className="hidden group-hover:block absolute right-0 min-w-[200px] dark:bg-darkBlue-3 shadow-onlyLight rounded-[8px]">
                    <Link href={'/fee-schedule/trading'}>
                        <a target='_blank'>
                            <div className="flex items-center justify-between h-[44px] bg-gray-5 p-[10px] rounded-t-[8px]">
                                <div>
                                    <span className="text-darkBlue font-medium pr-[10px]">{t('futures:fee_tier')}</span>
                                    <label className="text-teal font-semibold">VIP {vip?.level ?? 0}</label>
                                </div>
                                <div className="rotate-[270deg]"><ChevronDown /></div>
                            </div>
                        </a>
                    </Link>
                    <div className="p-[10px]">
                        <div className="flex items-center justify-between">
                            <label className="text-gray-1 font-medium">{t('futures:taker')}:</label>
                            <span className="font-medium">0.1%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-gray-1 font-medium">{t('futures:maker')}:</label>
                            <span className="font-medium">0.1%</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FuturesOrderCostAndMaxVndc
