import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import FuturesMarginMode from './MarginMode'
import FuturesOrderModule from './OrderModule'
import FuturesOrderTypes from './OrderTypes'

const FuturesPlaceOrder = ({ pairConfig }) => {
    // ? get rdx state
    const currentType = useSelector((state) => state.futures.orderType)

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2'>
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
