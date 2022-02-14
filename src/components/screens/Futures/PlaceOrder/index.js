import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import FuturesMarginMode from './MarginMode'
import FuturesOrderTypes from './OrderTypes'

const FuturesPlaceOrder = ({ config }) => {
    // ? get rdx state
    const currentType = useSelector((state) => state.futures.orderType)

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full'>
            <div className='relative'>
                <FuturesMarginMode />
                <div className='absolute left-0 -bottom-5 w-full h-5 dragHandleArea' />
            </div>
            <div className='mt-5'>
                <FuturesOrderTypes
                    currentType={currentType}
                    orderTypes={config?.orderTypes}
                />
            </div>
        </div>
    )
}

export default FuturesPlaceOrder
