import Link from 'next/link'

import { useWindowSize } from 'utils/customHooks'
import { useCallback } from 'react'

const ScreenPresent = () => {

    const { width } = useWindowSize()

    const renderMobile = useCallback(() => {
        return (
            <>
                <div className="landing_page___mb_screen_present__top">
                    <div className="landing_page___mb_screen_present__top__left">
                        <img src="images/screen/landing-page/ip_mb_top_left.png" alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___mb_screen_present__top__right">
                        <img src="images/screen/landing-page/ip_mb_top_right_1.png" alt="Nami Maldives"/>
                        <img src="images/screen/landing-page/ip_mb_top_right_2.png" alt="Nami Maldives"/>
                    </div>
                </div>
                <div className="landing_page___mb_screen_present__bott">
                    <div className="">
                        <img src="images/screen/landing-page/ip_mb_bott_1.png" alt="Nami Maldives"/>
                    </div>
                    <div className="">
                        <img src="images/screen/landing-page/ip_mb_bott_2.png" alt="Nami Maldives"/>
                    </div>
                    <div className="">
                        <img src="images/screen/landing-page/ip_mb_bott_3.png" alt="Nami Maldives"/>
                    </div>
                </div>

                <div className="landing_page___mb_screen_present__nami">
                    <img src="images/screen/landing-page/nami_maldives.png" alt="Nami Maldives"/>
                    <div className="landing_page___mb_screen_present__title">
                        Trải nghiệm mới.<br/>
                        Hành trình mới.
                    </div>
                    <div className="landing_page___mb_screen_present__description">
                        {width < 700 ?
                            <>
                                Lấy cảm hứng từ sự tự do, thân thiện và phóng khoáng của<br/>
                                Maldives, Nami Exchange mang đến bản nâng cấp toàn<br/>
                                diện giao diện, tốc độ tăng gấp 3 lần, số lượng cặp giao dịch<br/>
                                tăng gấp 2 lần, tối ưu trải nghiệm giúp giảm 50% thao tác.
                            </>
                            : <>
                                Lấy cảm hứng từ sự tự do, thân thiện và phóng khoáng của Maldives, Nami Exchange mang đến<br/>
                                bản nâng cấp toàn diện giao diện, tốc độ tăng gấp 3 lần, số lượng cặp giao dịch<br/>
                                tăng gấp 2 lần, tối ưu trải nghiệm giúp giảm 50% thao tác.
                            </>
                        }
                    </div>
                </div>

                <div className="landing_page___mb_screen_present__button___group">
                    <Link href="https://apps.apple.com/app/id1480302334">
                        <a className="landing_page___mb_screen_present___download__item" target="_blank">
                            <img src="/images/download_app_store.png" alt="Nami Exchange"/>
                        </a>
                    </Link>
                    <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                        <a className="landing_page___mb_screen_present___download__item" target="_blank">
                            <img src="/images/download_play_store.png" alt="Nami Exchange"/>
                        </a>
                    </Link>
                    <div className="landing_page___mb_screen_present___download__item">
                        <img src="/images/icon/ic_qr.png" alt="Nami Exchange"/>
                    </div>
                </div>
            </>
        )
    }, [width])

    const renderDesktop = () => {
        return (
            <div className="landing_page__screen_present">
                <div className="landing_page__screen_present__left">
                    <img src="images/screen/landing-page/ip_desk_left_1.png" alt="Nami Maldives"/>
                    <img src="images/screen/landing-page/ip_desk_left_2.png" alt="Nami Maldives"/>
                </div>
                <div className="landing_page__screen_present__center">
                    <div className="landing_page__screen_present__center__left">
                        <img src="images/screen/landing-page/ip_desk_center_1.png" alt="Nami Maldives"/>
                        <img src="images/screen/landing-page/ip_desk_center_2.png" alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page__screen_present__center__right">
                        <img src="images/screen/landing-page/ip_desk_center_3.png" alt="Nami Maldives"/>
                        <img src="images/screen/landing-page/ip_desk_center_4.png" alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page__screen_present__center__bott">
                        MALDIVES
                    </div>
                </div>
                <div className="landing_page__screen_present__right">
                    <img src="images/screen/landing-page/ip_desk_right_1.png" alt="Nami Maldives"/>
                    <img src="images/screen/landing-page/ip_desk_right_2.png" alt="Nami Maldives"/>
                </div>
            </div>
        )
    }

    return (
        <div className="landing_page___screen_present">
            {width >= 768 ? renderDesktop() : renderMobile()}
        </div>
    )
}

export default ScreenPresent
