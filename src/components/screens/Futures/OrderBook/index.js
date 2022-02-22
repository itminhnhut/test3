import { useEffect, useRef, useState } from 'react'
import {
    ApiStatus,
    ORDER_BOOK_MODE,
    PublicSocketEvent,
} from 'redux/actions/const'
import { API_GET_FUTURES_DEPTH } from 'redux/actions/apis'
import { getDecimalScale } from 'redux/actions/utils'
import { handleTickSize, roundNearest } from './orderBookHelper'
import { useAsync } from 'react-use'
import { isNumber, orderBy } from 'lodash'

import FuturesOrderBookFilter from './OrderBookFilter'
import FuturesOrderBookMerger from './OrderBookMerger'
import Emitter from 'redux/actions/emitter'
import Axios from 'axios'

const INITIAL_STATE = {
    loading: false,
    orderBook: null,
    tickSize: 0.01,
    tickSizeList: [],
    filterMode: ORDER_BOOK_MODE.ALL,
    componentHeight: 0,
}

const FuturesOrderBook = ({
    pairConfig,
    lastPrice,
    markPrice,
    orderBookLayout,
}) => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const ref = useRef()

    // ? Helper
    const initOrderBookData = (data, tickSize = 2) => {
        const ask = orderBy(data?.ask, (e) => +e[0]) || []
        const bids = orderBy(data?.bids, (e) => +e[0], 'desc') || []

        setState({
            orderBook: {
                ask: handleTickSize(ask, tickSize, 'ask'),
                bids: handleTickSize(bids || [], tickSize),
            },
        })
    }

    const onFilter = (filterMode) =>
        filterMode !== state.filterMode && setState({ filterMode })

    const onSetTickSize = (tickSize) =>
        tickSize !== state.tickSize && setState({ tickSize })

    // ? Side effect
    useAsync(async () => {
        if (!pairConfig?.pair) return
        !state.orderBook && setState({ loading: true })
        try {
            const { data } = await Axios.get(API_GET_FUTURES_DEPTH, {
                params: { symbol: pairConfig?.pair },
            })

            if (data?.status === ApiStatus.SUCCESS)
                initOrderBookData(data?.data, state.tickSize)
        } catch (e) {
            console.log(`Can't get orderbook data `, e)
        } finally {
            setState({ loading: false })
        }
    }, [])

    useEffect(() => {
        Emitter.on(
            PublicSocketEvent.FUTURES_DEPTH_UPDATE,
            (data) => data && initOrderBookData(data, state.tickSize)
        )
        return () => Emitter.off(PublicSocketEvent.FUTURES_DEPTH_UPDATE)
    }, [state.tickSize])

    useEffect(() => {
        if (ref.current?.clientHeight) {
            setState({
                componentHeight: ref.current.clientHeight,
            })
        }
    }, [ref.current, orderBookLayout?.h])

    useEffect(() => {
        const priceFilter = pairConfig?.filters?.find(
            (o) => o.filterType === 'PRICE_FILTER'
        )
        if (priceFilter) {
            const tickSize = +priceFilter.tickSize
            if (isNumber(tickSize) && tickSize) {
                const tickSizeList = []
                for (let i = 0; i < 5; i++) {
                    tickSizeList.push(tickSize * 10 ** i)
                }

                setState({
                    tickSize,
                    tickSizeList,
                })
            }
        }
    }, [pairConfig])

    return (
        <div ref={ref} className='px-3.5 h-full'>
            <div className='pt-5 py-2 futures-component-title dragHandleArea'>
                OrderBook
            </div>
            <div className='flex items-center justify-between'>
                <FuturesOrderBookFilter
                    filterMode={state.filterMode}
                    onFilter={onFilter}
                />
                <FuturesOrderBookMerger
                    tickSize={state.tickSize}
                    tickSizeList={state.tickSizeList}
                    onSetTickSize={onSetTickSize}
                />
            </div>
        </div>
    )
}

export default FuturesOrderBook
