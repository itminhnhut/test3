import Axios from 'axios'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import MarketTrend from 'version/maldives/m1/Market/MarketTrend'
import MarketTable from 'version/maldives/m1/Market/MarketTable'

import { useEffect, useState } from 'react'
import { API_GET_TRENDING } from 'redux/actions/apis'
import { useAsync } from 'react-use'
import { getMarketWatch } from 'redux/actions/market'

const MarketIndex = () => {
    // * Initial State
    const [state, set] = useState({
        loadingTrend: false,
        trending: null,
        loadingMarket: false,
        marketWatch: null
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    // * Helper
    const getTrending = async () => {
        setState({ loadingTrend: true })
        try {
            const { data } = await Axios.get(API_GET_TRENDING)
            if (data && data.status === 'ok' && data?.data) {
                const trending = []
                data.data.forEach(item => {
                    if (item.key === 'top_gainers' || item.key === 'top_losers') {
                        if (item.pairs) trending.push(item.pairs)
                    }
                })
                if (trending.length === 2) {
                    setState({ trending: [...trending[0], ...trending[1]] })
                }
            }
        } catch (e) {
            console.log('Cant get top trending data: ', e)
        } finally {
            setState(({ loadingTrend: false }))
        }
    }

    useEffect(() => {
        getTrending()
    }, [])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: ', state.trending)
    // }, [state.trending])

    useAsync(async () => {
        setState({ loadingMarket: true })
        const marketWatch = await getMarketWatch()
        if (marketWatch && marketWatch.length) {
            setState({ marketWatch })
        }
        setState({ loadingMarket: false })
    })


    return (
        <MaldivesLayout>
            <div className="w-full h-full bg-get-grey4 dark:bg-get-darkBlue1">
                <div className="mal-container">
                    <MarketTrend data={state.trending} loading={state.loadingTrend}/>
                    <MarketTable data={state.marketWatch} loading={state.loadingMarket}/>
                </div>
            </div>
        </MaldivesLayout>
    )
}

export default MarketIndex
