import AssetLogo from 'components/wallet/AssetLogo'
import colors from 'styles/colors'
import Image from 'next/image'
import Axios from 'axios'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_GET_TRENDING } from 'redux/actions/apis'
import { useWindowSize } from 'utils/customHooks'
import { ___DEV___, sparkLineBuilder } from 'utils/helpers'
import { useSelector } from 'react-redux'
import { formatPercentage, formatPrice, getExchange24hPercentageChange } from 'redux/actions/utils'

const HomeMarketTrend = () => {
    const [state, set] = useState({
        marketTabIndex: 0,
        trending: null,
        loadingTrend: false,
        publicSocketStatus: false,
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    // * Use Hooks
    const { width } = useWindowSize()
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig)
    const publicSocket = useSelector(state => state.socket.publicSocket)

    // * Helper
    const getTrending = async () => {
        setState({ loadingTrend: true })
        try {
            const { data } = await Axios.get(API_GET_TRENDING)
            if (data && data.status === 'ok') {
                setState({ trending: data?.data })
            }
        } catch (e) {
            console.log('Cant get top trending data: ', e)
        } finally {
            setState(({ loadingTrend: false }))
        }
    }

    // * Render Handler
    const renderTrendTab = useCallback(() => {
        return (
            <>
                <div className="homepage-markettrend__tab___item__wrapper">
                    <div className={`homepage-markettrend__tab___item
                                         ${state.marketTabIndex === 0 ? 'homepage-markettrend__tab___item__active' : ''}`}
                         onClick={() => setState({ marketTabIndex: 0 })}>
                        Top tăng giá
                    </div>
                    {width >= 992 && <div className={`homepage-markettrend__tab__item___selector
                                                              ${state.marketTabIndex === 0 ?
                        'homepage-markettrend__tab__item___selector__active' : ''}`}/>}
                </div>
                <div className="homepage-markettrend__tab___item__wrapper">
                    <div className={`homepage-markettrend__tab___item
                                         ${state.marketTabIndex === 1 ? 'homepage-markettrend__tab___item__active' : ''}`}
                         onClick={() => setState({ marketTabIndex: 1 })}>
                        Top giảm giá
                    </div>
                    {width >= 992 && <div className={`homepage-markettrend__tab__item___selector
                                                              ${state.marketTabIndex === 1 ?
                        'homepage-markettrend__tab__item___selector__active' : ''}`}/>}
                </div>
                <div className="homepage-markettrend__tab___item__wrapper">
                    <div className={`homepage-markettrend__tab___item
                                         ${state.marketTabIndex === 2 ? 'homepage-markettrend__tab___item__active' : ''}`}
                         onClick={() => setState({ marketTabIndex: 2 })}>
                        Giao dịch 24h
                    </div>
                    {width >= 992 && <div className={`homepage-markettrend__tab__item___selector
                                                              ${state.marketTabIndex === 2 ?
                        'homepage-markettrend__tab__item___selector__active' : ''}`}/>}
                </div>

                {width >= 992 && <a href="/trade" className="homepage-markettrend__market_table__explore">
                    Khám phá thêm
                </a>}
            </>
        )
    }, [width, state.marketTabIndex])

    const renderMarketHeader = useCallback(() => {
        return (
            <div className="homepage-markettrend__market_table__row">
                <div className="homepage-markettrend__market_table__row__col1">Cặp</div>
                <div className="homepage-markettrend__market_table__row__col2">Giá gần nhất</div>
                <div className="homepage-markettrend__market_table__row__col3">Thay đổi 24h</div>
                {width >= 576 &&
                <div className="homepage-markettrend__market_table__row__col4">Biểu đồ</div>}
            </div>
        )
    }, [width])

    const renderMarketBody = useCallback(() => {
        const data = state.trending && state.trending.length ? state.trending[state.marketTabIndex] : null
        if (!data) return
        const { pairs } = data

        return pairs.map(pair => {
            const { b, q, s, u, p} = pair
            const sparkLine = sparkLineBuilder(s, u ? colors.teal : colors.red2)

            return (
                <a href={`/trade/${b}-${q}`} className="homepage-markettrend__market_table__row" key={`markettrend_${s}__${state.marketTabIndex}`}>
                    <div className="homepage-markettrend__market_table__row__col1">
                        <div className="homepage-markettrend__market_table__coin">
                            <div className="homepage-markettrend__market_table__coin__icon">
                                <AssetLogo size={width >= 350 ? 30 : 26} assetCode={b}/>
                            </div>
                            <div className="homepage-markettrend__market_table__coin__pair">
                                <span>{b}</span>
                                <span>/{q}</span>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-markettrend__market_table__row__col2">
                        <div className="homepage-markettrend__market_table__price">
                            {formatPrice(p, exchangeConfig, s)}
                        </div>
                    </div>
                    <div className="homepage-markettrend__market_table__row__col3">
                        <div className={`homepage-markettrend__market_table__percent ${u ? 'value-up' : 'value-down'}`}>
                            {u ? '+ ' : '- '}{formatPercentage(getExchange24hPercentageChange(pair))}%
                        </div>
                    </div>
                    <div className="homepage-markettrend__market_table__row__col4">
                        <div className="homepage-markettrend__market_table__chart">
                            <img src={sparkLine} alt="Nami Exchange"/>
                        </div>
                    </div>
                </a>
            )
        })
    }, [width, state.trending, state.marketTabIndex, exchangeConfig])

    useEffect(() => {
        getTrending()
    }, [])

    return (
        <section className="homepage-markettrend">
            <div className="homepage-markettrend__wrapper mal-container">

                <div className="homepage-markettrend__tab_and_title">
                    <div className="homepage-markettrend__title">
                        Xu hướng thị trường
                    </div>
                    <div className="homepage-markettrend__tab">
                        {renderTrendTab()}
                    </div>
                </div>

                <div className="homepage-markettrend__market_table">
                    <div className="homepage-markettrend__market_table__wrapper">
                        <div className="homepage-markettrend__market_table__header">
                            {renderMarketHeader()}
                        </div>
                        <div className="homepage-markettrend__market_table__content">
                            {renderMarketBody()}
                        </div>
                    </div>
                    {width < 992 && <a href="/trade" className="homepage-markettrend__market_table__explore">
                        Khám phá thêm
                    </a>}
                </div>

            </div>
        </section>
    )
}

export default HomeMarketTrend
