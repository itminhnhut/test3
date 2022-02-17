import { useEffect, useMemo, useState } from 'react'
import { getFuturesMarketWatch, getMarketWatch } from 'redux/actions/market'
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants'
import { ApiStatus, PublicSocketEvent } from 'redux/actions/const'
import { WidthProvider, Responsive } from 'react-grid-layout'
import { API_GET_FUTURES_CONFIGS } from 'redux/actions/apis'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FUTURES_DEFAULT_SYMBOL } from './index'
import { NavBarBottomShadow } from 'components/common/NavBar/NavBar'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useAsync } from 'react-use'

import FuturesRecentTrades from 'components/screens/Futures/RecentTrades'
import FuturesFavoritePairs from 'components/screens/Futures/FavoritePairs'
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
import Axios from 'axios'
import Emitter from 'redux/actions/emitter'
import 'react-grid-layout/css/styles.css'

const GridLayout = WidthProvider(Responsive)
const originLayouts = getLayoutFromLS('layouts')

const INITIAL_STATE = {
    layouts: futuresGridConfig.layouts,
    pair: FUTURES_DEFAULT_SYMBOL,
    prevPair: null,
    socketStatus: false,
    pairTicker: null,
    forceUpdateState: 1,
}

const Futures = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const publicSocket = useSelector((state) => state.socket.publicSocket)
    const allConfigs = useSelector((state) => state.futures.pairConfig)

    const router = useRouter()
    const { width } = useWindowSize()
    const isMediumDevices = width >= BREAK_POINTS.lg

    // Memmoized Variable
    const pairConfig = useMemo(
        () => allConfigs?.find((o) => o.pair === state.pair),
        [allConfigs, state.pair]
    )

    // Helper
    const onLayoutChange = (layout, layouts) => {
        setLayoutToLS('layouts', layouts)
        setState({ layouts })
    }

    useEffect(() => {
        if (!!originLayouts) {
            setState({ layouts: JSON.parse(JSON.stringify(originLayouts)) })
        }
    }, [])

    useEffect(() => {
        if (router?.query?.pair) {
            setState({ pair: router.query.pair })
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.pair
            )
        }
    }, [router])

    // ? Subscribe public socket

    // ? Get Pair Ticker
    useEffect(() => {
        Emitter.on(
            PublicSocketEvent.FUTURES_TICKER_UPDATE + state.pair,
            async (data) => {
                console.log('Futures Ticker Emitting...', data)
            }
        )
    }, [state.pair])

    useEffect(() => {
        console.log('pairConfig: ', pairConfig)
    }, [pairConfig])

    useEffect(() => {
        console.log('Watching pairTicker: ', state.pair, state.pairTicker)
    }, [state.pairTicker, state.pair])

    return (
        <>
            <FuturesPageTitle pair={state.pair} />
            <DynamicNoSsr>
                <MaldivesLayout useNavShadow hideFooter>
                    <div className='-mt-5 w-full'>
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
                                <div
                                    key={futuresGridKey.favoritePair}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesFavoritePairs
                                        forceUpdateState={
                                            state.forceUpdateState
                                        }
                                    />
                                </div>
                                <div
                                    key={futuresGridKey.pairDetail}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesPairDetail />
                                </div>
                                <div
                                    key={futuresGridKey.chart}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesChart />
                                </div>
                                <div
                                    key={futuresGridKey.orderBook}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesOrderBook />
                                </div>
                                <div
                                    key={futuresGridKey.recentTrades}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesRecentTrades />
                                </div>
                                <div
                                    key={futuresGridKey.tradeRecord}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesTradeRecord />
                                </div>
                                <div
                                    key={futuresGridKey.placeOrder}
                                    className='border border-divider dark:border-divider-dark'
                                >
                                    <FuturesPlaceOrder
                                        pairConfig={pairConfig}
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
