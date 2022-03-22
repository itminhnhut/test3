import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'
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
    assumingPrice,
}) => {
    const [leverage, setLeverage] = useState(0)
    const [percentage, setPercentage] = useState(null)
    const [price, setPrice] = useState('')
    const [stopPrice, setStopPrice] = useState('')
    const [size, setSize] = useState('')
    const [selectedAsset, setSelectedAsset] = useState(null)
    const [initialMargin, setInitialMargin] = useState(0)

    // ? get rdx state
    const preloadedForm = useSelector((state) => state.futures.preloadedState)
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

    useEffect(() => {
        // Limit initial margin
        if ([OrderTypes.Limit, OrderTypes.StopLimit].includes(currentType)) {
            if (price && size && leverage) {
                setInitialMargin((+price * +size) / leverage)
            }
        } else {
            setInitialMargin(0)
        }

        // ? Market initial margin
        if ([OrderTypes.Market, OrderTypes.StopMarket].includes(currentType)) {
            if (assumingPrice && price && size && leverage) {
                setInitialMargin([
                    (assumingPrice?.ask * (1 + 0.0005) * 0.2) / leverage,
                    (max([assumingPrice?.bid, markPrice]) * 0.2) /
                        state.leverage,
                ])
            } else {
                setInitialMargin(0)
            }
        }
    }, [currentType, markPrice, assumingPrice, leverage, size, price])

    useEffect(() => {
        getLeverage(pairConfig?.pair)
        if (pairConfig?.quoteAsset) {
            setSelectedAsset(pairConfig.quoteAsset)
        }
    }, [pairConfig])

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
                price={price}
                stopPrice={stopPrice}
                size={size}
                setPrice={setPrice}
                setStopPrice={setStopPrice}
                setAsset={setSelectedAsset}
                setSize={setSize}
            />

            <FuturesOrderCostAndMax
                selectedAsset={selectedAsset}
                initialMargin={initialMargin}
                price={price}
                assumingPrice={assumingPrice}
                currentType={currentType}
                pairConfig={pairConfig}
                markPrice={markPrice}
            />
        </div>
    )
}

export default FuturesPlaceOrder
