import { memo, useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { mergeFuturesFavoritePairs } from 'redux/actions/futures'
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'

import FuturesFavoritePairItem from './FavoritePairItem'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import InfoSlider from 'components/markets/InfoSlider'
import colors from 'styles/colors'
import axios from 'axios'
import Star from 'components/svg/Star'

const FuturesFavoritePairs = memo(({ forceUpdateState }) => {
    const [loading, setLoading] = useState(false)
    const [refreshMarketWatch, setRefreshMarketWatch] = useState(null)

    const favoritePairs = useSelector((state) => state.futures.favoritePairs)
    const publicSocket = useSelector((state) => state.socket.publicSocket)

    const fetchMarketWatch = async (isRefresh = false) => {
        !isRefresh && setLoading(true)
        try {
            const { data } = await axios.get(API_GET_FUTURES_MARKET_WATCH)
            if (data?.status === ApiStatus.SUCCESS) {
                setRefreshMarketWatch(data?.data)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const renderPairItems = useCallback(() => {
        const marketWatch = refreshMarketWatch?.map((o) =>
            FuturesMarketWatch.create(o)
        )
        const pairs = mergeFuturesFavoritePairs(favoritePairs, marketWatch)
        return pairs?.map((pair) => (
            <FuturesFavoritePairItem key={pair?.symbol} pair={pair} />
        ))
    }, [favoritePairs, refreshMarketWatch])

    useEffect(() => {
        // Init
        fetchMarketWatch()

        // Refresh per 1.5s
        let interval = setInterval(() => fetchMarketWatch(true), 1500)
        return () => interval && clearInterval(interval)
    }, [])

    return (
        <div className='h-full flex items-center pr-3'>
            <div className='flex items-center pl-5 pr-[10px] h-full dragHandleArea'>
                <Star size={16} fill={colors.yellow} />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <InfoSlider gutter={18} forceUpdateState={forceUpdateState}>
                    {renderPairItems()}
                </InfoSlider>
            )}
        </div>
    )
})

export default FuturesFavoritePairs
