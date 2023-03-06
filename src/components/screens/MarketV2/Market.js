import MarketTrend from 'components/screens/MarketV2/MarketTrend';
import MarketTable, { favSubTab, subTab, tab } from 'components/screens/MarketV2/MarketTable';
import Axios from 'axios';
import styled from 'styled-components';
import useWindowFocus from 'hooks/useWindowFocus';
import { getExchange24hPercentageChange } from 'redux/actions/utils';
import { useCallback, useEffect, useState } from 'react';
import { API_GET_REFERENCE_CURRENCY, API_GET_TRENDING } from 'redux/actions/apis';
import { getFuturesMarketWatch, getMarketWatch } from 'redux/actions/market';
import { favoriteAction } from 'redux/actions/user';
import { TRADING_MODE } from 'redux/actions/const';
import { marketWatchToFavorite } from 'utils';
import { useSelector } from 'react-redux';

import { isMobile } from 'react-device-detect';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import LayoutMobile from 'components/common/layouts/LayoutMobile'
import { useMemo } from 'react';
import FetchApi from 'utils/fetch-api';

const Market = () => {
    // * Initial State
    const [state, set] = useState({
        currentPage: 1,
        tabIndex: 1,
        subTabIndex: 1,
        search: '',
        loadingTrend: false,
        trending: null,
        loading: false,
        watch: null,
        favoriteList: null,
        exchangeMarket: null,
        futuresMarket: null,
        tabLabelCount: null,
        favType: 0,
        type: 0
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    const { user: auth } = useSelector(state => state.auth) || null
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const futuresConfigs = useSelector((state) => state?.futures?.pairConfigs);

    let categories = useMemo(() => {
        const data = {
            MOST_TRADED: [],
            TOP_GAINER: [],
            TOP_LOSER: [],
            NEW_LISTING: []
        }
        exchangeConfig?.map(e => {
            e?.tags?.map(tag => {
                if (data[tag]?.some(e => e === e?.symbol)) return
                data[tag]?.push(e.symbol)
            })
        })
        return data
    }, [exchangeConfig])

    const [referencePrice, setReferencePrice] = useState([])

    useEffect(() => {
        FetchApi({
            url: API_GET_REFERENCE_CURRENCY,
            params: { base: 'VNDC,USDT', quote: 'USD' },
        })
            .then(({ data = [] }) => {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [`${current.base}/${current.quote}`]: current.price,
                        }
                    }, {})
                )
            })
            .catch((err) => console.error(err))
    }, [])

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

    const getMarket = async (tradingMode, isInitial = true) => {
        isInitial && setState({ loading: true })
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
        !state.favoriteList && setState({ loading: true })
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
            await getMarket(TRADING_MODE.EXCHANGE, false)
        }

        // Refresh Futures pair price
        if (key === 'futures' || (key === 'favorite' && subKey === 'futures')) {
            await getMarket(TRADING_MODE.FUTURES, false)
        }

        // Refresh trending slide price
        await getTrending()
    }


    const suggestedSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'LTC', 'DOT']
    const suggested = useMemo(() => {
        const q = subTab[state.subTabIndex].key.toUpperCase()
        if (q === 'ALL') return state?.exchangeMarket?.filter(e => suggestedSymbols.includes(e.b))
        return state?.exchangeMarket?.filter(e => suggestedSymbols.includes(e.b) && e.q === q)
    }, [state?.exchangeMarket, state.subTabIndex])


    // * Render Handler
    const renderMarketTable = useCallback(() => {
        return (
            <MarketTable data={state.watch}
                favoriteList={state.favoriteList}
                favoriteRefresher={getFavorite}
                loading={state.loading}
                parentState={setState}
                tabIndex={state.tabIndex}
                subTabIndex={state.subTabIndex}
                search={state.search}
                currentPage={state.currentPage}
                tabLabelCount={state.tabLabelCount}
                type={state.type}
                auth={auth}
                suggestedSymbols={suggested}
                favType={state.favType}
                futuresConfigs={futuresConfigs}
                referencePrice={referencePrice}
            />
        )
    }, [
        state.loading,
        state.tabIndex,
        state.subTabIndex,
        state.search,
        state.watch,
        state.currentPage,
        state.tabLabelCount,
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
        setState({ loading: true })
        let watch = []
        let convert = []

        const asset = subTab[state.subTabIndex].key === 'vndc' ? 'VNDC' : 'USDT'

        if (state.exchangeMarket && state.futuresMarket) {
            convert = {
                exchange: marketWatchToFavorite(state.favoriteList?.exchange, TRADING_MODE.EXCHANGE, state.exchangeMarket),
                futures: marketWatchToFavorite(state.favoriteList?.futures, TRADING_MODE.FUTURES, state.futuresMarket, true)
            }
        }
        // Favorite data handling
        if (tab[state.tabIndex].key === 'favorite') {
            if (favSubTab[state.favType]?.key === 'exchange') {
                // log.d('Tab Favorite - Exchange')
                watch = convert?.exchange
            }
            if (favSubTab[state.favType]?.key === 'futures') {
                // log.d('Tab Favorite - Futures')
                watch = convert?.futures
            }

            if (subTab[state.subTabIndex].key === 'vndc') {
                // log.d('Tab Exchange - VNDC')
                watch = watch.filter(e => e.q === 'VNDC')
            } else if (subTab[state.subTabIndex].key === 'usdt') {
                // log.d('Tab Exchange - USDT')
                watch = watch.filter(e => e.q === 'USDT')
            }
        }

        // Exchange data handling
        if (tab[state.tabIndex].key === 'exchange') {
            if (subTab[state.subTabIndex].key === 'vndc' && state.exchangeMarket) {
                // log.d('Tab Exchange - VNDC')
                watch = state.exchangeMarket.filter(e => e.q === 'VNDC')
            } else if (subTab[state.subTabIndex].key === 'usdt' && state.exchangeMarket) {
                // log.d('Tab Exchange - USDT')
                watch = state.exchangeMarket.filter(e => e.q === 'USDT')
            } else {
                // log.d('Tab Exchange - ALL')
                watch = state?.exchangeMarket
            }
        }

        // Futures data handling
        if (tab[state.tabIndex].key === 'futures') {
            if (subTab[state.subTabIndex].key === 'vndc' && state.futuresMarket) {
                // log.d('Tab Futures - VNDC')
                watch = state.futuresMarket.filter(e => e.q === 'VNDC')
            } else if (subTab[state.subTabIndex].key === 'usdt' && state.futuresMarket) {
                // log.d('Tab Futures - USDT')
                watch = state.futuresMarket.filter(e => e.q === 'USDT')
            } else {
                // log.d('Tab Futures - ALL')
                watch = state?.futuresMarket
            }
        }

        // Search data handling
        if (state.search) {
            watch = filterer([...watch], state.search.toLowerCase())
        }

        // Count searched items
        if (state.search && convert && state.exchangeMarket && state.futuresMarket) {

            const favorite = filterer([...convert?.exchange, ...convert?.futures], state.search.toLowerCase())
            const exchange = filterer(state.exchangeMarket.filter(e => e.q === asset), state.search.toLowerCase())
            const futures = filterer(state.futuresMarket.filter(e => e.q === asset), state.search.toLowerCase())

            setState({
                tabLabelCount: {
                    favorite: favorite?.length,
                    exchange: exchange?.length,
                    futures: futures?.length
                }
            })
        } else {
            setState({ tabLabelCount: null })
        }

        if (tab[state.tabIndex].key !== 'favorite') {
            if(watch && watch.length){
                switch (state.type) {
                    case 0:
                        break;
                    case 'MOST_TRADED':
                        watch = watch.sort((a, b) => {
                            const diff = b.vq - a.vq
                            if (diff === 0) return 0
                            return diff > 0 ? 1 : -1
                        })
                        break;
                    case 'TOP_GAINER':
                        watch = watch.sort((a, b) => {
                            const diff = getExchange24hPercentageChange(b) - getExchange24hPercentageChange(a)
                            if (diff === 0) return 0
                            return diff > 0 ? 1 : -1
                        })
                        break;
                    case 'TOP_LOSER':
                        watch = watch.sort((a, b) => {
                            const diff = getExchange24hPercentageChange(b) - getExchange24hPercentageChange(a)
                            if (diff === 0) return 0
                            return (diff > 0) ? -1 : 1
                        })
                        break;
                    default:
                        watch = watch?.filter(e => categories[state.type]?.includes(e.s))
                        break;
                }
            }
        }

        // Set watching data
        setState({ watch, loading: false })
    }, [
        state.exchangeMarket,
        state.futuresMarket,
        state.favoriteList,
        state.tabIndex,
        state.subTabIndex,
        state.search,
        state.type,
        state.favType
    ])

    const renderContent = () => {
        return (
            <div className="w-full h-full pb-[120px]">
                <div className='max-w-screen-v3 2xl:max-w-screen-xxl sm:px-8 m-auto'>
                    <MarketTrend data={state.trending} loading={state.loadingTrend} />
                    {renderMarketTable()}
                </div>
            </div>
        )
    }

    return <MaldivesLayout>{renderContent()}</MaldivesLayout>
}

const filterer = (data, keyWord) => {
    if (!data) return []
    return data.filter(w => {
        const origin1 = `${w?.b}`.toLowerCase()
        const origin2 = `${w?.b}${w?.q}`.toLowerCase()
        const origin3 = `${w?.b}/${w?.q}`.toLowerCase()

        return origin1.includes(keyWord) || origin2.includes(keyWord) || origin3.includes(keyWord)
    })
}

const MarketWrapper = styled.div.attrs({ className: 'mal-container' })`
  max-width: 1216px;
`

export default Market
