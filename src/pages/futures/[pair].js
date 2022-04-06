import { useEffect, useMemo, useState } from 'react'
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants'
import { ApiStatus, PublicSocketEvent } from 'redux/actions/const'
import { WidthProvider, Responsive } from 'react-grid-layout'
import { useSelector, useDispatch } from 'react-redux'
import {
    API_GET_FUTURES_CONFIGS,
    API_GET_FUTURES_MARKET_WATCH,
    API_GET_FUTURES_MARK_PRICE,
} from 'redux/actions/apis'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FUTURES_DEFAULT_SYMBOL } from './index'
import { NavBarBottomShadow } from 'components/common/NavBar/NavBar'
import { useRouter } from 'next/router'
import { useAsync } from 'react-use'
import { roundTo } from 'round-to'

import FuturesMarketWatch from '../../models/FuturesMarketWatch'
import FuturesMarkPrice from '../../models/FuturesMarkPrice'
import FuturesFavoritePairs from 'components/screens/Futures/FavoritePairs'
import FuturesRecentTrades from 'components/screens/Futures/RecentTrades'
import FuturesTradeRecord from 'components/screens/Futures/TradeRecord'
import FuturesMarginRatio from 'components/screens/Futures/MarginRatio'
import FuturesPairDetail from 'components/screens/Futures/PairDetail'
import FuturesPlaceOrder from 'components/screens/Futures/PlaceOrder'
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle'
import FuturesOrderBook from 'components/screens/Futures/OrderBook'
import FuturesChart from 'components/screens/Futures/FuturesChart'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import futuresGridConfig, {
    futuresGridKey,
    getLayoutFromLS,
    setLayoutToLS,
} from 'components/screens/Futures/_futuresGrid'
import useWindowSize from 'hooks/useWindowSize'
import DynamicNoSsr from 'components/DynamicNoSsr'
import dynamic from 'next/dynamic'
import Emitter from 'redux/actions/emitter'
import Axios from 'axios'

import 'react-grid-layout/css/styles.css'
import { log } from 'utils'

const GridLayout = WidthProvider(Responsive)
const originLayouts = getLayoutFromLS('layouts')

const FuturesProfitEarned = dynamic(
    () => import('components/screens/Futures/TakedProfit'),
    { ssr: false }
)

const INITIAL_STATE = {
    layouts: futuresGridConfig.layouts,
    loading: false,
    pair: null,
    prevPair: null,
    socketStatus: false,
    pairPrice: null,
    markPrice: null,
    forceUpdateState: 1,
    favoritePairLayout: null,
    orderBookLayout: null,
    tradeRecordLayout: null,
    isVndcFutures: false,
    assumingPrice: null,
}

const Futures = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const publicSocket = useSelector((state) => state.socket.publicSocket)
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs)
    const marketWatch = useSelector((state) => state.futures.marketWatch)
    const auth = useSelector((state) => state.auth?.user)
    const userSettings = useSelector((state) => state.futures.userSettings)

    const router = useRouter()
    const { width } = useWindowSize()
    const isMediumDevices = width >= BREAK_POINTS.lg

    // Memmoized Variable
    const pairConfig = useMemo(
        () => allPairConfigs?.find((o) => o.pair === state.pair),
        [allPairConfigs, state.pair]
    )

    // Helper
    const getPairMarkPrice = async (symbol) => {
        if (!symbol) return
        setState({ loading: true })
        try {
            const { data } = await Axios.get(API_GET_FUTURES_MARK_PRICE, {
                params: { symbol },
            })
            if (data?.status === ApiStatus.SUCCESS) {
                setState({
                    markPrice: FuturesMarkPrice.create(data?.data?.[0]),
                })
            }
        } catch (e) {
            console.log(`Can't get ${symbol} marketWatch `, e)
        }
    }

    const subscribeFuturesSocket = (pair) => {
        if (!publicSocket) {
            setState({ socketStatus: !!publicSocket })
        } else {
            if (
                !state.prevPair ||
                state.prevPair !== pair ||
                !!publicSocket !== state.socketStatus
            ) {
                publicSocket.emit('subscribe:futures:depth', pair)
                publicSocket.emit('subscribe:futures:recent_trade', pair)
                // publicSocket.emit('subscribe:futures:ticker', pair)
                publicSocket.emit('subscribe:futures:mark_price', pair)
                publicSocket.emit('subscribe:futures:ticker', 'all')
                // publicSocket.emit('subscribe:futures:mini_ticker', 'all')

                setState({ socketStatus: !!publicSocket, prevPair: pair })
            }
        }
    }

    const unsubscribeFuturesSocket = (pair) => {
        publicSocket?.emit('unsubscribe:futures:depth', pair)
        publicSocket?.emit('unsubscribe:futures:recent_trade', pair)
        publicSocket?.emit('unsubscribe:futures:ticker', 'all')
        publicSocket?.emit('unsubscribe:futures:mark_price', pair)
        // publicSocket?.emit('unsubscribe:futures:mini_ticker', 'all')
    }

    const onLayoutChange = (layout, layouts) => {
        setLayoutToLS('layouts', layouts)
        setState({
            layouts,
            favoritePairLayout: layout?.find(
                (o) => o.i === futuresGridKey.favoritePair
            ),
            orderBookLayout: layout?.find(
                (o) => o.i === futuresGridKey.orderBook
            ),
            tradeRecordLayout: layout?.find(
                (o) => o.i === futuresGridKey.tradeRecord
            ),
            forceUpdateState: state.forceUpdateState + 1,
        })
    }

    const setOrderInput = (depth = { rate: 0, amount: 0 }) => {
        console.log('Set Input ', depth)
    }

    // ? Init Price and MarkPrice
    useEffect(() => {
        setState({ pairPrice: null })
        if (Array.isArray(marketWatch) && marketWatch?.length) {
            setState({
                pairPrice: marketWatch.find((o) => o.symbol === state.pair),
                forceUpdateState: state.forceUpdateState + 1,
            })
        }
    }, [marketWatch, state.pair])

    useEffect(() => {
        setState({ markPrice: null })
        getPairMarkPrice(state.pair)
    }, [state.pair])

    useEffect(() => {
        // ? Hide global scroll
        document.body.className += ' no-scrollbar'

        // Re-init lastest layouts
        if (!!originLayouts) {
            log.d('Re-init layouts', JSON.parse(JSON.stringify(originLayouts)))
            setState({
                layouts: JSON.parse(JSON.stringify(originLayouts)),
                forceUpdateState: state.forceUpdateState + 1,
            })
        }
        return () => {
            document.body.className = document.body.className?.replace(
                'no-scrollbar',
                ''
            )
        }
    }, [])

    // Re-load Previous Pair
    useEffect(() => {
        if (router?.query?.pair) {
            setState({ pair: router.query.pair })
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.pair
            )
        }
    }, [router])

    useEffect(() => {
        if (!state.pair) return

        // ? Subscribe publicSocket
        subscribeFuturesSocket(state.pair)

        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, async (data) => {
            const pairPrice = FuturesMarketWatch.create(data)
            if (state.pair === pairPrice?.symbol) {
                setState({ pairPrice })
            }
        })

        // ? Get Mark Price
        Emitter.on(
            PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE + state.pair,
            async (data) => {
                const markPrice = FuturesMarkPrice.create(data)
                if (
                    state.pair === markPrice?.symbol &&
                    !!markPrice?.markPrice
                ) {
                    setState({ markPrice })
                }
            }
        )

        // ? Unsubscribe publicSocket
        return () => {
            publicSocket && unsubscribeFuturesSocket(state.pair)
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE)
            Emitter.off(PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE)
        }
    }, [publicSocket, state.pair])

    useEffect(() => {
        log.i('pairConfig => ', pairConfig, userSettings, state.layouts)
        setState({ isVndcFutures: pairConfig?.quoteAsset === 'VNDC' })
    }, [pairConfig, userSettings, state.layouts])

    return (
        <>
            <FuturesPageTitle
                pair={state.pair}
                price={state.pairPrice?.lastPrice}
                pricePrecision={pairConfig?.pricePrecision}
            />
            <DynamicNoSsr>
                <MaldivesLayout
                    // useGridSettings
                    navStyle={{
                        boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)',
                    }}
                    hideFooter
                >
                    <div className='w-full'>
                        {isMediumDevices && (
                            <GridLayout
                                className='layout'
                                layouts={state.layouts}
                                breakpoints={futuresGridConfig.breakpoints}
                                cols={futuresGridConfig.cols}
                                margin={[-1, -1]}
                                containerPadding={[0, 0]}
                                rowHeight={24}
                                draggableHandle='.dragHandleArea'
                                draggableCancel='.dragCancelArea'
                                onLayoutChange={(_layout, _layouts) =>
                                    onLayoutChange(_layout, _layouts)
                                }
                                onResize={(e) =>
                                    setState({
                                        forceUpdateState:
                                            state.forceUpdateState + 1,
                                    })
                                }
                            >
                                {auth && (
                                    <div
                                        key={futuresGridKey.favoritePair}
                                        className='border border-divider dark:border-divider-dark'
                                    >
                                        <FuturesFavoritePairs
                                            favoritePairLayout={
                                                state.favoritePairLayout
                                            }
                                        />
                                    </div>
                                )}
                                <div
                                    key={futuresGridKey.pairDetail}
                                    className='relative z-20 border border-divider dark:border-divider-dark'
                                >
                                    <FuturesPairDetail
                                        pairPrice={state.pairPrice}
                                        markPrice={state.markPrice}
                                        pairConfig={pairConfig}
                                        forceUpdateState={
                                            state.forceUpdateState
                                        }
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.chart}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesChart
                                        pair={pairConfig?.pair}
                                        initTimeFrame='1D'
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.orderBook}
                                    className='border z-20 border-divider dark:border-divider-dark'
                                >
                                    <FuturesOrderBook
                                        pairConfig={pairConfig}
                                        markPrice={state.markPrice?.markPrice}
                                        lastPrice={state.pairPrice?.lastPrice}
                                        orderBookLayout={state.orderBookLayout}
                                        setOrderInput={setOrderInput}
                                        setAssumingPrice={(assumingPrice) =>
                                            setState({ assumingPrice })
                                        }
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.recentTrades}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesRecentTrades
                                        pairConfig={pairConfig}
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.tradeRecord}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesTradeRecord
                                        isVndcFutures={state.isVndcFutures}
                                        layoutConfig={state.tradeRecordLayout}
                                        pairConfig={pairConfig}
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.placeOrder}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesPlaceOrder
                                        isAuth={!!auth}
                                        markPrice={state.markPrice?.markPrice}
                                        lastPrice={state.pairPrice?.lastPrice}
                                        pairConfig={pairConfig}
                                        userSettings={userSettings}
                                        assumingPrice={state.assumingPrice}
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.marginRatio}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesMarginRatio />
                                </div>
                            </GridLayout>
                        )}
                    </div>
                </MaldivesLayout>
            </DynamicNoSsr>
            <FuturesProfitEarned isVisible={false} />
        </>
    )
}

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
            ])),
        },
    }
}

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { pair: FUTURES_DEFAULT_SYMBOL } }],
        fallback: true,
    }
}

export default Futures
