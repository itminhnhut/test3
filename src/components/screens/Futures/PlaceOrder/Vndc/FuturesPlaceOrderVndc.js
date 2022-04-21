import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { FuturesOrderTypes as OrderTypes, FuturesStopOrderMode, } from 'redux/reducers/futures';
import { roundToDown } from 'round-to';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';
import FuturesOrderModule from '../OrderModule';
import FuturesOrderTypes from '../OrderTypes';
import PlaceConfigs from '../PlaceConfigs';
import axios from 'axios';
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
    const [price, setPrice] = useState(lastPrice)
    const [stopPrice, setStopPrice] = useState(lastPrice)
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
    const firstTime = useRef(true);

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
            buy: roundToDown(buy, pairConfig?.quantityPrecision || 2),
            sell: roundToDown(sell, pairConfig?.quantityPrecision || 2),
        })
    }, [maxBuy, maxSell, size])

    const handlePrice = (price) => {
        setPrice(price)
    }

    useEffect(() => {
        handleQuantity('')
        setStopOrderMode(FuturesStopOrderMode.markPrice)
        if (currentType === OrderTypes.Limit || currentType === OrderTypes.StopMarket) {
            setPrice(lastPrice)
            setStopPrice(lastPrice)
        }
    }, [currentType])

    useEffect(() => {
        if (firstTime.current && lastPrice) {
            firstTime.current = false;
            setPrice(lastPrice);
        }
    }, [firstTime.current, lastPrice])

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
        const _price = currentType === OrderTypes.Limit ? price : stopPrice;
        if ((availableAsset)) {
            let maxBuy = 0;
            let maxSell = 0;
            if ([OrderTypes.Limit, OrderTypes.StopMarket].includes(currentType) && _price) {
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / _price;
                maxSell = maxBuy;
            } else if ([OrderTypes.Market].includes(currentType)) {
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / ask;
                maxSell = availableAsset / ((1 / leverage) + (0.1 / 100)) / bid;
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
        bid,
        stopPrice
    ])

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2 !overflow-x-hidden overflow-y-auto'>
            <div className='relative'>
                <PlaceConfigs
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    userSettings={userSettings}
                    isVndcFutures={isVndcFutures}
                    isAuth={isAuth}
                />
                <div className='absolute left-0 -bottom-5 w-full h-5 dragHandleArea' />
            </div>

            <div className='mt-5'>
                <FuturesOrderTypes
                    currentType={currentType}
                    orderTypes={pairConfig?.orderTypes}
                    isVndcFutures={isVndcFutures}
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
                isAuth={isAuth}
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
                stopPrice={stopPrice}
            />
        </div>
    )
}

export default FuturesPlaceOrderVndc
