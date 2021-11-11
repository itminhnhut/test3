import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import MarketTrend from 'version/maldives/m1/Market/MarketTrend'
import MarketTable, { favSubTab, subTab, tab } from 'version/maldives/m1/Market/MarketTable'
import Axios from 'axios'
import styled from 'styled-components'
import useWindowFocus from 'hooks/useWindowFocus'

import { useCallback, useEffect, useState } from 'react'
import { API_GET_TRENDING } from 'redux/actions/apis'
import { getFuturesMarketWatch, getMarketWatch } from 'redux/actions/market'
import { favoriteAction } from 'redux/actions/user'
import { TRADING_MODE } from 'redux/actions/const'
import { log, marketWatchToFavorite } from 'utils'
import { useSelector } from 'react-redux'

const MarketIndex = () => {
    // * Initial State
    const [state, set] = useState({
        currentPage: 1,
        tabIndex: 0,
        subTabIndex: 0,
        search: '',
        loadingTrend: false,
        trending: null,
        loading: false,
        watch: null,
        favoriteList: null,
        exchangeMarket: null,
        futuresMarket: null
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    const { user: auth } = useSelector(state => state.auth) || null

    // * Use Hooks
    const focused = useWindowFocus()

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

    const getMarket = async (tradingMode) => {
        setState({ loading: true })
        try {
            if (tradingMode) {
                if (tradingMode === TRADING_MODE.EXCHANGE) {
                    const _ = await getMarketWatch()
                    setState({ exchangeMarket: _ })
                } else {
                    const _ = await getFuturesMarketWatch()
                    setState({ futuresMarket: Object.values(_) })
                }
            } else {
                const exchangeMarket = await getMarketWatch()
                const futuresMarket = await getFuturesMarketWatch()
                setState({ exchangeMarket, futuresMarket: Object.values(futuresMarket) })
            }
        } catch (e) {

        } finally {
            setState({ loading: false })
        }
    }

    const getFavorite = async () => {
        setState({ loading: true })
        try {
            const exchange = await favoriteAction('get', TRADING_MODE.EXCHANGE)
            const futures = await favoriteAction('get', TRADING_MODE.FUTURES)

            setState({ favoriteList: { exchange, futures } })
        } catch (e) {
            console.log('Cant get favorite list ', e)
            return []
        } finally {
            setState({ loading: false })
        }
    }

    const reNewHelper = async (tabIndex, subTabIndex) => {
        const { key } = tab[tabIndex]
        const { key: subKey } = key === 'favorite' ? favSubTab[subTabIndex] : subTab[subTabIndex]

        // Refresh Exchange pair price
        if (key === 'exchange' || (key === 'favorite' && subKey === 'exchange')) {
            await getMarket(TRADING_MODE.EXCHANGE)
        }

        // Refresh Futures pair price
        if (key === 'futures' || (key === 'favorite' && subKey === 'futures')) {
            await getMarket(TRADING_MODE.FUTURES)
        }

        // Refresh trending slide price
        await getTrending()
    }

    // * Render Handler
    const renderMarketTable = useCallback(() => {
        return (
            <MarketTable data={state.watch}
                         loading={state.loading}
                         parentState={setState}
                         tabIndex={state.tabIndex}
                         subTabIndex={state.subTabIndex}
                         search={state.search}
                         currentPage={state.currentPage}
                         auth={auth}
            />
        )
    }, [
        state.loading,
        state.tabIndex,
        state.subTabIndex,
        state.search,
        state.watch,
        state.currentPage,
        auth
    ])


    useEffect(() => {
        getTrending()
        getFavorite()
        getMarket()
    }, [])

    // Re-new api data
    useEffect(() => {
        let interval

        if (focused) {
            interval = setInterval(() => reNewHelper(state.tabIndex, state.subTabIndex), 2800)
        }

        return () => interval && clearInterval(interval)
    }, [state.tabIndex, state.subTabIndex, focused])

    useEffect(() => {
        let watch = []

        // Favorite data handling
        if (tab[state.tabIndex].key === 'favorite' && state.exchangeMarket && state.futuresMarket) {
            const convert = {
                exchange: marketWatchToFavorite(state.favoriteList?.exchange, TRADING_MODE.EXCHANGE, state.exchangeMarket),
                futures: marketWatchToFavorite(state.favoriteList?.futures, TRADING_MODE.FUTURES, state.futuresMarket, true)
            }

            if (favSubTab[state.subTabIndex]?.key === 'exchange') {
                log.d('Tab Favorite - Exchange')
                watch = convert?.exchange
            }
            if (favSubTab[state.subTabIndex]?.key === 'futures') {
                log.d('Tab Favorite - Futures')
                watch = convert?.futures
            }
        }

        // Exchange data handling
        if (tab[state.tabIndex].key === 'exchange') {
            if (subTab[state.subTabIndex].key === 'vndc' && state.exchangeMarket) {
                log.d('Tab Exchange - VNDC')
                watch = state.exchangeMarket.filter(e => e.q === 'VNDC')
            } else if (subTab[state.subTabIndex].key === 'usdt' && state.exchangeMarket) {
                log.d('Tab Exchange - USDT')
                watch = state.exchangeMarket.filter(e => e.q === 'USDT')
            } else {
                log.d('Tab Exchange - ALL')
                watch = state?.exchangeMarket
            }
        }

        // Futures data handling
        if (tab[state.tabIndex].key === 'futures') {
            if (subTab[state.subTabIndex].key === 'vndc' && state.futuresMarket) {
                log.d('Tab Futures - VNDC')
                watch = state.futuresMarket.filter(e => e.q === 'VNDC')
            } else if (subTab[state.subTabIndex].key === 'usdt' && state.futuresMarket) {
                log.d('Tab Futures - USDT')
                watch = state.futuresMarket.filter(e => e.q === 'USDT')
            } else {
                log.d('Tab Futures - ALL')
                watch = state?.futuresMarket
            }
        }

        // Search data handling
        if (state.search) {
            const keyWord = state.search.toLowerCase()
            watch = [...watch].filter(w => {
                const origin1 = `${w?.b}`.toLowerCase()
                const origin2 = `${w?.b}${w?.q}`.toLowerCase()
                return origin1.includes(keyWord) || origin2.includes(keyWord)
            })
            // console.log('namidev-DEBUG: FILTERED ___ ', filtered)
        }

        // Count searched items

        // Set watching data
        setState({ watch })
    }, [
        state.exchangeMarket,
        state.futuresMarket,
        state.favoriteList,
        state.tabIndex,
        state.subTabIndex,
        state.search
    ])

    // useEffect(() => {
    //     log.d('Display Data: ', state.watch)
    // }, [state.watch])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: Watching Favorite Change ', state.favoriteList)
    // }, [state.favoriteList])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: Watching ExchangeMarket ', state.exchangeMarket)
    // }, [state.exchangeMarket])
    //
    // useEffect(() => {
    //     console.log('namidev-DEBUG: Watching ', tab[state.tabIndex].key,
    //                 tab[state.tabIndex].key === 'favorite' ? favSubTab[state.subTabIndex].key : subTab[state.subTabIndex].key)
    // }, [state.tabIndex, state.subTabIndex])

    return (
        <MaldivesLayout>
            <div className="w-full h-full bg-get-grey4 dark:bg-darkBlue-1">
                <MarketWrapper>
                    <MarketTrend data={state.trending} loading={state.loadingTrend}/>
                    {renderMarketTable()}
                </MarketWrapper>
            </div>
        </MaldivesLayout>
    )
}

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

export default MarketIndex
