import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis'
import {
    FuturesOrderTypes as OrderTypes,
    FuturesStopOrderMode,
} from 'redux/reducers/futures'
import { roundToDown } from 'round-to'
import { useSelector } from 'react-redux'
import { ApiStatus } from 'redux/actions/const'

import FuturesOrderCostAndMax from '../OrderCostAndMax'
import FuturesOrderModule from '../OrderModule'
import FuturesOrderTypes from '../OrderTypes'
import PlaceConfigs from '../PlaceConfigs'
import axios from 'axios'
import max from 'lodash/max'
import { log } from 'utils'
import FuturesOrderCostAndMaxVndc from './OrderCostAndMaxVndc';

const FuturesPlaceOrderVndc = ({
    pairConfig,
    userSettings,
    markPrice,
    lastPrice,
    assumingPrice,
    isAuth,
    isVndcFutures,
    ask,
    bid
}) => {
    const [leverage, setLeverage] = useState(1)
    const [percentage, setPercentage] = useState(null)
    const [price, setPrice] = useState('')
    const [stopPrice, setStopPrice] = useState('')
    const [size, setSize] = useState('')
    const [quantity, setQuantity] = useState({ buy: '', sell: '' })
    const [selectedAsset, setSelectedAsset] = useState(null)
    const [stopOrderMode, setStopOrderMode] = useState(
        FuturesStopOrderMode.markPrice
    )
    const [assetReversed, setAssetReversed] = useState(false)
    const [availableAsset, setAvailableAsset] = useState(null)
    const [maxBuy, setMaxBuy] = useState(0)
    const [maxSell, setMaxSell] = useState(0)

    // ? get rdx state
    const preloadedForm = useSelector((state) => state.futures.preloadedState)
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES)
    const currentType = useMemo(
        () => preloadedForm?.orderType || OrderTypes.Limit,
        [preloadedForm]
    )

    const getLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            setLeverage(data?.data?.[pairConfig?.pair])
        }
    }

    const handleQuantity = useCallback(
        (size, isPercent = false) => {
            setSize(size)
        },
        [maxBuy, maxSell, assetReversed]
    )

    useEffect(() => {
        const _size = isNaN(size) ? Number(size.substring(0, size.indexOf('%'))) / 100 : Number(size);
        const buy = _size * maxBuy;
        const sell = _size * maxSell;
        setQuantity({
            buy: buy,
            sell: roundToDown(sell, pairConfig?.quantityPrecision || 2),
        })
    }, [maxBuy, maxSell, size])

    const handlePrice = (price) => {
        setPrice(price)
    }

    useEffect(() => {
        handleQuantity('')
        setStopOrderMode(FuturesStopOrderMode.markPrice)
    }, [currentType])

    useEffect(() => {
        isAuth && getLeverage(pairConfig?.pair)
        if (pairConfig?.baseAsset) {
            setSelectedAsset(pairConfig.baseAsset)
        }
    }, [pairConfig, isAuth])

    useEffect(() => {
        if (selectedAsset === pairConfig?.quoteAsset) {
            setAssetReversed(true)
        } else {
            setAssetReversed(false)
        }
    }, [pairConfig, selectedAsset])

    useEffect(() => {
        if (avlbAsset) {
            const _avlb = avlbAsset?.[pairConfig?.quoteAssetId]
            setAvailableAsset(_avlb?.value - _avlb?.locked_value)
        }
    }, [avlbAsset, pairConfig])

    useEffect(() => {
        const _size = isNaN(size) ? Number(size.substring(0, size.indexOf('%'))) / 100 : size;
        if (availableAsset && _size && leverage) {
            let maxBuy = 0;
            let maxSell = 0;
            if ([OrderTypes.Limit, OrderTypes.StopLimit].includes(currentType) && price > 0) {
                maxBuy = availableAsset / ((1 / leverage) + (_size * price * 0.1));
                maxSell = maxBuy;
            } else if ([OrderTypes.Market, OrderTypes.StopMarket].includes(currentType)) {
                maxBuy = availableAsset / ((1 / leverage) + (_size * ask * 0.1));
                maxSell = availableAsset / ((1 / leverage) + (_size * bid * 0.1));
            }
            setMaxBuy(maxBuy)
            setMaxSell(maxSell)
        } else {
            setMaxBuy(0)
            setMaxSell(0)
        }
    }, [
        availableAsset,
        price,
        size,
        leverage,
        currentType,
        assetReversed,
        ask,
        bid
    ])

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2 !overflow-x-hidden overflow-y-auto'>
            <div className='relative'>
                <PlaceConfigs
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    userSettings={userSettings}
                />
                <div className='absolute left-0 -bottom-5 w-full h-5 dragHandleArea' />
            </div>

            <div className='mt-5'>
                <FuturesOrderTypes
                    currentType={currentType}
                    orderTypes={pairConfig?.orderTypes}
                />
            </div>

            <FuturesOrderModule
                markPrice={markPrice}
                lastPrice={lastPrice}
                selectedAsset={selectedAsset}
                currentLeverage={leverage}
                currentType={currentType}
                pairConfig={pairConfig}
                positionMode={userSettings?.dualSidePosition || false}
                price={price}
                stopPrice={stopPrice}
                size={size}
                quantity={quantity}
                handleQuantity={handleQuantity}
                handlePrice={handlePrice}
                setStopPrice={setStopPrice}
                stopOrderMode={stopOrderMode}
                setStopOrderMode={setStopOrderMode}
                setAsset={setSelectedAsset}
                availableAsset={availableAsset}
                isReversedAsset={assetReversed}
                isVndcFutures={isVndcFutures}
                ask={ask}
                bid={bid}
            />

            <FuturesOrderCostAndMaxVndc
                price={price}
                size={size}
                quantity={quantity}
                leverage={leverage}
                currentType={currentType}
                selectedAsset={selectedAsset}
                assumingPrice={assumingPrice}
                pairConfig={pairConfig}
                markPrice={markPrice}
                isAssetReversed={assetReversed}
                availableAsset={availableAsset}
                lastPrice={lastPrice}
                maxBuy={maxBuy}
                maxSell={maxSell}
                ask={ask}
                bid={bid}
            />
        </div>
    )
}

export default FuturesPlaceOrderVndc
