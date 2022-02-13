import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { LOCAL_STORAGE_KEY } from 'constants/constants'
import { FUTURES_DEFAULT_SYMBOL } from './index'
import { NavBarBottomShadow } from 'components/common/NavBar/NavBar'

import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import FuturesFavoritePair from 'components/screens/Futures/FavoritePair'
import FuturesPairDetail from 'components/screens/Futures/PairDetail'
import FuturesChart from 'components/screens/Futures/FuturesChart'
import FuturesOrderBook from 'components/screens/Futures/OrderBook'
import FuturesRecentTrades from 'components/screens/Futures/RecentTrades'
import FuturesPlaceOrder from 'components/screens/Futures/PlaceOrder'
import FuturesTradeRecord from 'components/screens/Futures/TradeRecord'

const Futures = () => {
    const router = useRouter()

    useEffect(() => {
        if (router?.query?.symbol) {
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.symbol
            )
        }
    }, [router])

    return (
        <MaldivesLayout useNavShadow hideFooter>
            <div className='-mt-5'>
                <FuturesFavoritePair />
                <FuturesPairDetail />
                <FuturesChart />
                <FuturesOrderBook />
                <FuturesRecentTrades />
                <FuturesTradeRecord />
                <FuturesPlaceOrder />
            </div>
        </MaldivesLayout>
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
