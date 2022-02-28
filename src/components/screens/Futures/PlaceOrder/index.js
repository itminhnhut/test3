import { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'

import FuturesMarginMode from './MarginMode'
import FuturesOrderModule from './OrderModule'
import FuturesOrderTypes from './OrderTypes'

const FuturesPlaceOrder = ({ pairConfig }) => {
    // ? get rdx state
    const preloadedForm = useSelector((state) => state.futures.preloadedForm)
    const currentType = useMemo(
        () => preloadedForm?.orderType || OrderTypes.Limit,
        [preloadedForm]
    )

    useEffect(() => {
        console.log('preloadedForm ', preloadedForm)
    }, [preloadedForm])

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2 !overflow-x-hidden overflow-y-auto'>
            <div className='relative'>
                <FuturesMarginMode />
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
