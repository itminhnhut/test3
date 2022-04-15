import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { PublicSocketEvent } from 'redux/actions/const'
import { debounce } from 'lodash'
import { PATHS } from 'constants/paths'

import FuturesMarketWatch from 'models/FuturesMarketWatch'
import classNames from 'classnames'
import Emitter from 'redux/actions/emitter'
import { usePrevious } from 'react-use'
import { formatNumber } from 'redux/actions/utils'
import { roundTo } from 'round-to'

const FuturesPairListItems = ({ pairConfig, changePercent24h }) => {
    const [pairTicker, setPairTicker] = useState(null)

    const publicSocket = useSelector((state) => state.futures.publicSocket)
    const marketWatch = useSelector((state) => state.futures.marketWatch)

    const prevLastPrice = usePrevious(pairTicker?.lastPrice)
    const prev24hChangePercent = usePrevious(pairTicker?.priceChangePercent)

    const router = useRouter()

    const onReceiveTicker = debounce((ticker) => setPairTicker(ticker), 1000)

    const renderContract = useCallback(() => {
        return (
            <div style={{ flex: '1 1 0%' }} className='flex items-center'>
                <div></div> {pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}
            </div>
        )
    }, [pairConfig?.pair])

    const renderLastPrice = useCallback(() => {
        return (
            <div
                style={{ flex: '1 1 0%' }}
                className={classNames('justify-end text-right text-dominant', {
                    '!text-red': pairTicker?.lastPrice < prevLastPrice,
                })}
            >
                {pairTicker?.lastPrice
                    ? formatNumber(
                        pairTicker?.lastPrice,
                        pairConfig?.pricePrecision
                    )
                    : '--'}
            </div>
        )
    }, [pairTicker?.lastPrice, prevLastPrice])

    const render24hChange = useCallback(() => {
        return (
            <div
                style={{ flex: '1 1 0%' }}
                className={classNames(
                    'justify-end text-right text-dominant', //text-darkBlue-5 dark:text-darkBlue-5
                    {
                        '!text-red': pairTicker?.priceChangePercent < 0,
                    }
                )}
            >
                {pairTicker?.priceChangePercent
                    ? formatNumber(
                        roundTo(pairTicker.priceChangePercent, 2),
                        2,
                        2,
                        true
                    ) + '%'
                    : '--'}
            </div>
        )
    }, [pairTicker?.priceChangePercent])

    const renderTotalVolume = useCallback(() => {
        return (
            <div
                style={{ flex: '1 1 0%' }}
                className='justify-end text-right text-darkBlue-5 dark:text-darkBlue-5'
            >
                {pairTicker?.priceChangePercent || '--'}
            </div>
        )
    }, [])

    useEffect(() => {
        if (pairConfig?.pair && !pairTicker && marketWatch) {
            setPairTicker(marketWatch.find((o) => o.symbol === pairConfig.pair))
        }
    }, [pairTicker, marketWatch, pairConfig?.pair])

    useEffect(() => {
        if (pairConfig?.pair) {
            Emitter.on(
                PublicSocketEvent.FUTURES_TICKER_UPDATE,
                async (data) => {
                    if (data) {
                        const _pairTicker = FuturesMarketWatch.create(data, pairConfig?.quoteAsset)
                        if (_pairTicker?.symbol === pairConfig.pair) {
                            setPairTicker(_pairTicker)
                        }
                    }
                }
            )
        }

        return () => Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE)
    }, [publicSocket, pairConfig?.pair])

    // useEffect(() => console.log('MinTicker => ', pairTicker), [pairTicker])

    return (
        <div
            className='px-4 py-0.5 flex items-center justify-between font-medium text-xs rounded-[2px] hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer select-none'
            onClick={() =>
                router.push(PATHS.FUTURES_V2.DEFAULT + `/${pairConfig?.pair}`)
            }
        >
            {renderContract()}
            {renderLastPrice()}
            {render24hChange()}
        </div>
    )
}

export default FuturesPairListItems
