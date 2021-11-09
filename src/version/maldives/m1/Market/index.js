import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import MarketTrend from 'version/maldives/m1/Market/MarketTrend'
import MarketTable from 'version/maldives/m1/Market/MarketTable'
import Axios from 'axios'
import styled from 'styled-components'

import { useEffect, useState } from 'react'
import { API_GET_TRENDING } from 'redux/actions/apis'
import { useAsync } from 'react-use'
import { getMarketWatch } from 'redux/actions/market'

const MarketWrapper = styled.div.attrs({ className: 'mal-container' })`
  @media (min-width: 1024px) {
    max-width: 980px !important;
  }

  @media (min-width: 1280px) {
    max-width: 1164px !important;
  }

  @media (min-width: 1366px) {
    max-width: 1280px !important;
  }
  
  @media (min-width: 1440px) {
    max-width: 1366px !important;
  }

  @media (min-width: 1920px) {
    max-width: 1440px !important;
  }

  @media (min-width: 2560px) {
    max-width: unset !important;
  }
`

const MarketIndex = () => {
    // * Initial State
    const [state, set] = useState({
        tabIndex: 0,
        subTabIndex: 0,
        search: '',
        loadingTrend: false,
        trending: null,
        loadingExchangeMarket: false,
        exchangeMarketWatch: null,
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

    useAsync(async () => {
        setState({ loadingExchangeMarket: true })
        const exchangeMarketWatch = await getMarketWatch()
        if (exchangeMarketWatch && exchangeMarketWatch.length) {
            setState({ exchangeMarketWatch })
        }
        setState({ loadingExchangeMarket: false })
    })


    return (
        <MaldivesLayout>
            <div className="w-full h-full bg-get-grey4 dark:bg-get-darkBlue1">
                <MarketWrapper>
                    <MarketTrend data={state.trending} loading={state.loadingTrend}/>
                    <MarketTable data={state.exchangeMarketWatch}
                                 loading={state.loadingExchangeMarket}
                                 parentState={setState}
                                 tabIndex={state.tabIndex}
                                 subTabIndex={state.subTabIndex}
                                 search={state.search}
                    />
                </MarketWrapper>
            </div>
        </MaldivesLayout>
    )
}

export default MarketIndex
