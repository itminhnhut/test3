import { memo, useEffect, useState } from 'react'
import { PublicSocketEvent } from 'redux/actions/const'
import { formatNumber } from 'redux/actions/utils'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { roundTo } from 'round-to'
import { PATHS } from 'constants/paths'

import FuturesMiniTicker from 'models/FuturesMiniTicker'
import classNames from 'classnames'

const FuturesFavoritePairItem = memo(({ pair }) => {
    const router = useRouter()
    console.log('Pairs ', pair)
    return (
        <div
            className='flex items-center font-medium text-xs px-2.5 py-2 hover:bg-gray-4 dark:hover:bg-darkBlue-3 cursor-pointer rounded-md select-none'
            onClick={() =>
                router.query?.pair !== pair?.symbol &&
                router.push(PATHS.FUTURES_V2.DEFAULT + `/${pair?.symbol}`)
            }
        >
            <div className='mr-1 text-gray-1'>{pair?.symbol}</div>
            <div
                className={classNames('tracking-wide min-w-[40px] text-right', {
                    'text-red': pair?.priceChangePercent < 0,
                    'text-dominant': pair?.priceChangePercent >= 0,
                })}
            >
                {formatNumber(roundTo(pair?.priceChangePercent, 2), 2, 2, true)}
                %
            </div>
        </div>
    )
})

export default FuturesFavoritePairItem
