import colors from 'styles/colors'
import Link from 'next/link'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation, Trans } from 'next-i18next'
import { getMarketWatch } from 'redux/actions/market'
import { useWindowSize } from 'utils/customHooks'
import { PulseLoader } from 'react-spinners'
import { useAsync } from 'react-use'
import { getS3Url } from 'redux/actions/utils'

const HomeIntroduce = ({ parentState }) => {
    const [state, set] = useState({
        pairsLength: null,
        loading: false,
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const { width } = useWindowSize()
    const { t } = useTranslation(['home'])

    const animRef = useRef()

    const renderIntroduce = useCallback(() => {
        return (
            <section className="homepage-introduce">
                <div className="homepage-introduce___wrapper mal-container">
                    <div className="homepage-introduce___wrapper__left">
                        <div className="homepage-introduce___nami_exchange">NAMI EXCHANGE</div>
                        <div className="homepage-introduce___title">
                            {width < 576 ? <>{t('home:introduce.title_mobile')}</>
                                : <>{t('home:introduce.title_desktop1')}<br/>{t('home:introduce.title_desktop2')}</>
                            }
                        </div>
                        <div className="homepage-introduce___description">
                            <Trans>{t('home:introduce.description')}</Trans>
                        </div>
                        <div className="homepage-introduce___download">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a className="homepage-introduce___download__item" target="_blank">
                                    <img src={getS3Url('/images/download_app_store.png')} alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a className="homepage-introduce___download__item" target="_blank">
                                    <img src={getS3Url("/images/download_play_store.png")} alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <div className="homepage-introduce___download__item"
                                 onClick={() => parentState({ showQR: true })}>
                                <img src={getS3Url("/images/icon/ic_qr.png")} alt="Nami Exchange"/>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-introduce___wrapper__right">
                        <div ref={animRef} className="homepage-introduce___graphics">
                            <div className="homepage-introduce___graphics__anim__wrapper">
                                <img src={getS3Url("/images/screen/homepage/banner_graphics.png")} alt="Nami Exchange"/>
                            </div>
                        </div>
                        {/*{width >= 1024 &&*/}
                        {/*<div className="homepage-introduce___graphics__backward">*/}
                        {/*    <img src={getS3Url("/images/screen/homepage/electric_pattern.png")} alt="Nami Exchange"/>*/}
                        {/*</div>}*/}
                    </div>
                    <div className="homepage-introduce___statitics">
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                $7,166,943
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                {t('home:introduce.total_order_paid')}
                            </div>
                        </div>
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                200,000 +
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                {t('home:introduce.total_user')}
                            </div>
                        </div>
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                {state.loading ? <PulseLoader size={5} color={colors.teal}/>
                                    : state.pairsLength}
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                {t('home:introduce.total_pairs')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }, [width, state.loading, state.pairsLength])

    useAsync(async () => {
        setState({ loading: true })
        const pairs = await getMarketWatch()
        if (pairs && pairs.length) {
            setState({ pairsLength: pairs.length })
        }
        setState({ loading: false })
    })

    // useEffect(() => console.log('namidev-DEBUG: MarketWatch____' , state), [state])

    return renderIntroduce()
}

export default HomeIntroduce
