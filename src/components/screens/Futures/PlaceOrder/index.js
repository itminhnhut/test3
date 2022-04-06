import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'
import { roundToDown } from 'round-to'
import { useSelector } from 'react-redux'
import { ApiStatus } from 'redux/actions/const'

import FuturesOrderCostAndMax from './OrderCostAndMax'
import FuturesOrderModule from './OrderModule'
import FuturesOrderTypes from './OrderTypes'
import PlaceConfigs from './PlaceConfigs'
import axios from 'axios'
import max from 'lodash/max'

const FuturesPlaceOrder = ({
    pairConfig,
    userSettings,
    markPrice,
    lastPrice,
    assumingPrice,
    isAuth,
}) => {
    const [leverage, setLeverage] = useState(1)
    const [percentage, setPercentage] = useState(null)
    const [price, setPrice] = useState('')
    const [stopPrice, setStopPrice] = useState('')
    const [size, setSize] = useState('')
    const [parsedSize, setParsedSize] = useState('')
    const [selectedAsset, setSelectedAsset] = useState(null)
    const [assetReversed, setAssetReversed] = useState(false)
    const [availableAsset, setAvailableAsset] = useState(null)

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

    const handleQuantity = (size, isPercent = false) => {
        if (isPercent) {
            console.log('Percent...', size)
            setSize(size)
            if (assetReversed) {
                setParsedSize((parseFloat(size) / 100) * availableAsset)
            } else {
                setParsedSize(
                    ((parseFloat(size) / 100) * availableAsset) / lastPrice
                )
            }
        } else {
            setSize(size)
            setParsedSize(size)
        }
    }

    const handlePrice = (price) => {
        setPrice(price)
    }

    useEffect(() => {
        handleQuantity('')
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
                selectedAsset={selectedAsset}
                currentLeverage={leverage}
                currentType={currentType}
                pairConfig={pairConfig}
                positionMode={userSettings?.dualSidePosition || false}
                price={price}
                stopPrice={stopPrice}
                size={size}
                quantity={parsedSize}
                handlePrice={handlePrice}
                setStopPrice={setStopPrice}
                setAsset={setSelectedAsset}
                handleQuantity={handleQuantity}
                availableAsset={availableAsset}
            />

            <FuturesOrderCostAndMax
                price={price}
                size={parsedSize}
                leverage={leverage}
                currentType={currentType}
                selectedAsset={selectedAsset}
                assumingPrice={assumingPrice}
                currentType={currentType}
                pairConfig={pairConfig}
                markPrice={markPrice}
                isAssetReversed={assetReversed}
                availableAsset={availableAsset}
                lastPrice={lastPrice}
            />
        </div>
    )
}

export default FuturesPlaceOrder
