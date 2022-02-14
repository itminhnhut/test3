import { useEffect, useMemo, useState } from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import { API_GET_FUTURES_CONFIGS } from 'redux/actions/apis'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FUTURES_DEFAULT_SYMBOL } from './index'
import { NavBarBottomShadow } from 'components/common/NavBar/NavBar'
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants'
import { ApiStatus } from 'redux/actions/const'
import { useRouter } from 'next/router'
import { useAsync } from 'react-use'

import FuturesRecentTrades from 'components/screens/Futures/RecentTrades'
import FuturesFavoritePair from 'components/screens/Futures/FavoritePair'
import FuturesTradeRecord from 'components/screens/Futures/TradeRecord'
import FuturesMarginRatio from 'components/screens/Futures/MarginRatio'
import FuturesPairDetail from 'components/screens/Futures/PairDetail'
import FuturesPlaceOrder from 'components/screens/Futures/PlaceOrder'
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
import 'react-grid-layout/css/styles.css'

const GridLayout = WidthProvider(Responsive)
const originLayouts = getLayoutFromLS('layouts')

const Futures = () => {
    const [layouts, setLayouts] = useState(futuresGridConfig.layouts)
    const [loadingConfigs, setLoadingConfigs] = useState(false)
    const [allConfigs, setAllConfigs] = useState(null)

    const router = useRouter()
    const { width } = useWindowSize()
    const isMediumDevices = width >= BREAK_POINTS.lg

    // Memmoized Variable
    const pairConfig = useMemo(
        () => allConfigs?.find((o) => o.pair === router.query?.pair),
        [allConfigs, router.query]
    )

    // Helper
    const onLayoutChange = (layout, layouts) => {
        setLayoutToLS('layouts', layouts)
        setLayouts(layouts)
    }

    useEffect(() => {
        if (!!originLayouts) {
            setLayouts(JSON.parse(JSON.stringify(originLayouts)))
        }
    }, [])

    useEffect(() => {
        if (router?.query?.symbol) {
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.symbol
            )
        }
    }, [router])

    useAsync(async () => {
        setLoadingConfigs(true)
        const { data } = await Axios.get(API_GET_FUTURES_CONFIGS)
        if (data?.status === ApiStatus.SUCCESS) {
            setAllConfigs(data?.data)
        }
        setLoadingConfigs(false)
    }, [])

    useEffect(() => {
        console.log('pairConfig: ', pairConfig)
    }, [pairConfig])

    return (
        <DynamicNoSsr>
            <MaldivesLayout useNavShadow hideFooter>
                <div className='-mt-5 w-full'>
                    {isMediumDevices && (
                        <GridLayout
                            className='layout'
                            layouts={layouts}
                            breakpoints={futuresGridConfig.breakpoints}
                            cols={futuresGridConfig.cols}
                            margin={[-1, -1]}
                            containerPadding={[0, 0]}
                            rowHeight={30}
                            draggableHandle='.dragHandleArea'
                            draggableCancel='.dragCancelArea'
                            onLayoutChange={(_layout, _layouts) =>
                                onLayoutChange(_layout, _layouts)
                            }
                        >
                            <div
                                key={futuresGridKey.favoritePair}
                                className='border border-divider dark:border-divider-dark'
                            >
                                <FuturesFavoritePair />
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
                                <FuturesPlaceOrder pairConfig={pairConfig} />
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
    )
}

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar'])),
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
