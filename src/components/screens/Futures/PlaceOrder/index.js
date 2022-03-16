import { useEffect, useMemo, useState } from 'react'
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'
import { useSelector } from 'react-redux'
import { ApiStatus } from 'redux/actions/const'

import FuturesOrderModule from './OrderModule'
import FuturesOrderTypes from './OrderTypes'
import PlaceConfigs from './PlaceConfigs'
import axios from 'axios'

const FuturesPlaceOrder = ({ pairConfig, userSettings, markPrice }) => {
    const [leverage, setLeverage] = useState(0)

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
        getLeverage(pairConfig?.pair)
    }, [pairConfig?.pair])

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
                currentLeverage={leverage}
                currentType={currentType}
                pairConfig={pairConfig}
            />
        </div>
    )
}

export default FuturesPlaceOrder
