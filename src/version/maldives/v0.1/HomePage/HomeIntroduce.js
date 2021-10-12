import Link from 'next/link'

import { useWindowSize } from 'utils/customHooks'
import { useCallback } from 'react'

const HomeIntroduce = ({ parentState }) => {
    const { width } = useWindowSize()

    const renderIntroduce = useCallback(() => {
        return (
            <section className="homepage-introduce">
                <div className="homepage-introduce___wrapper mal-container">
                    <div className="homepage-introduce___wrapper__left">
                        <div className="homepage-introduce___nami_exchange">NAMI EXCHANGE</div>
                        <div className="homepage-introduce___title">
                            {width < 576 ? <>Giao dịch Spot và Futures ngay</>
                                : <>Sàn giao dịch Spot và<br/>Futures an toàn</>
                            }
                        </div>
                        <div className="homepage-introduce___description">
                            Với nền tảng quản lý và đầu tư tiền điện tử an toàn nhất
                        </div>
                        <div className="homepage-introduce___download">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a className="homepage-introduce___download__item" target="_blank">
                                    <img src="/images/download_app_store.png" alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a className="homepage-introduce___download__item" target="_blank">
                                    <img src="/images/download_play_store.png" alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <div className="homepage-introduce___download__item"
                                 onClick={() => parentState({ showQR: true })}>
                                <img src="/images/icon/ic_qr.png" alt="Nami Exchange"/>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-introduce___wrapper__right">
                        <div className="homepage-introduce___graphics">
                            <img src="/images/screen/homepage/dual_coin.png" alt="Nami Exchange"/>
                        </div>
                        {width >= 1024 &&
                        <div className="homepage-introduce___graphics__backward">
                            <img src="/images/screen/homepage/electric_pattern.png" alt="Nami Exchange"/>
                        </div>}
                    </div>
                    <div className="homepage-introduce___statitics">
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                $7,166,943
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                Khối lượng giao dịch trong 24 giờ
                            </div>
                        </div>
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                1,000,000 +
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                Người dùng đã đăng kí
                            </div>
                        </div>
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                6000 +
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                Token đã được niêm yết
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }, [width])

    return renderIntroduce()
}

export default HomeIntroduce
