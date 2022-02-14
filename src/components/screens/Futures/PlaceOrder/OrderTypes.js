import { memo } from 'react'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures'
import { useDispatch, useSelector } from 'react-redux'
import { SET_FUTURES_ORDER_TYPES } from 'redux/actions/types'
import { Info } from 'react-feather'

import classNames from 'classnames'

const FuturesOrderTypes = memo(({ currentType, orderTypes }) => {
    const dispatch = useDispatch()

    const setOrderTypes = (payload) =>
        currentType !== payload &&
        dispatch({
            type: SET_FUTURES_ORDER_TYPES,
            payload,
        })

    const renderTabTypes = () => {
        const types = []
        orderTypes?.forEach(
            (o) => SupportedOrderTypes.includes(o) && types.push(o)
        )
        if (!types.length) return null
        return types.map((o) => (
            <div
                key={`futures_margin_mode_${o}`}
                className={classNames(
                    'pb-2 min-w-[78px] text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs text-center capitalize cursor-pointer border-b-[2px] border-transparent',
                    {
                        '!text-txtPrimary dark:!text-txtPrimary-dark border-dominant':
                            o === currentType,
                    },
                    `w-1/${types.length}`
                )}
                onClick={() => setOrderTypes(o)}
            >
                {o.toLowerCase()}
            </div>
        ))
    }

    return (
        <div className='relative flex items-center'>
            <div className='relative z-20 mr-[18px] flex flex-grow'>
                {renderTabTypes()}
            </div>
            <div className='pb-2.5 cursor-help'>
                <Info
                    size={16}
                    strokeWidth={1.8}
                    className='text-txtSecondary dark:text-txtSecondary-dark hover:text-txtPrimary dark:hover:text-txtPrimary-dark'
                />
            </div>
            <div className='absolute z-10 w-full left-0 bottom-0 h-[2px] bg-divider dark:bg-divider-dark' />
        </div>
    )
})

const SupportedOrderTypes = Object.values(OrderTypes)

export default FuturesOrderTypes
