import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'

import FuturesOrderModule from './OrderModule'
import FuturesOrderTypes from './OrderTypes'
import PlaceConfigs from './PlaceConfigs'

const FuturesPlaceOrder = ({ pairConfig, userSettings }) => {
    // ? get rdx state
    const preloadedForm = useSelector((state) => state.futures.preloadedState)
    const currentType = useMemo(
        () => preloadedForm?.orderType || OrderTypes.Limit,
        [preloadedForm]
    )

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2 !overflow-x-hidden overflow-y-auto'>
            <div className='relative'>
                <PlaceConfigs
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
                currentType={currentType}
                pairConfig={pairConfig}
            />
        </div>
    )
}

export default FuturesPlaceOrder
