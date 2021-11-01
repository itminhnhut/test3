import ScreenPresentation from 'version/maldives/v0.1/LandingPage/ScreenPresentation'
import AttractiveFeatures from 'version/maldives/v0.1/LandingPage/AttractiveFeatures'
import PaymentAndKYC from 'version/maldives/v0.1/LandingPage/PaymentAndKYC'
import ThemingSystem from 'version/maldives/v0.1/LandingPage/ThemingSystem'
import MadivesLayout from 'components/common/layouts/MaldivesLayout'
import {default as MobileScreenPresent } from 'version/maldives/v0.1/LandingPage/ScreenPresent'

import colors from 'styles/colors'
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar'
import { useWindowSize } from 'utils/customHooks'
import { useTranslation } from 'next-i18next'

const LandingPage = () => {
    // Use Hooks
    const { width } = useWindowSize()
    const { t } = useTranslation(['maldives'])

    return (
        <MadivesLayout
            navMode={NAVBAR_USE_TYPE.FLUENT}
            navStyle={{
                backgroundColor: colors.darkBlue2
            }}
            contentWrapperStyle={{
                color: `${colors.darkBlue} !important`
            }}
        >
            {/* Screen Presentation */}
            {width < 992 ? <MobileScreenPresent/> : <ScreenPresentation/>}

            {/* Experience Compare */}
            <div className="landing_page___exp_compare">
                <div className="landing_page___section_title mal-container">
                    {t('maldives:landing_page.exp_compare_title')}
                </div>
                <div className="landing_page___exp_compare__wrapper mal-container">
                    <div className="landing_page___exp_compare__left">
                        <div className="landing_page___exp_compare__item">
                            <div className="landing_page___exp_compare__item___reason">
                                <div className="landing_page___exp_compare__item___reason__title">
                                    Nami - {t('maldives:landing_page.compare.previous_version')}
                                </div>
                                <div className="landing_page___exp_compare__item___reason__item">
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_1')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_2')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_3')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_4')}
                                    </div>
                                </div>
                            </div>
                            <img src="images/screen/landing-page/ip_compare_left.png"
                                 alt="Nami Maldives"/>
                        </div>
                    </div>
                    <div style={width < 768 ? { marginTop: 20 } : {}} className="landing_page___exp_compare__right">
                        <div className="landing_page___exp_compare__item">
                            <div className="landing_page___exp_compare__item___reason">
                                <div className="landing_page___exp_compare__item___reason__title">
                                    Nami - Maldives M1
                                </div>
                                <div className="landing_page___exp_compare__item___reason__item">
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_m1')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_m2')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_m3')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_m4')}
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> {t('maldives:landing_page.compare.compare_m5')}
                                    </div>
                                </div>
                            </div>
                            <img src="images/screen/landing-page/ip_compare_right.png"
                                 alt="Nami Maldives"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Theming System */}
            <ThemingSystem/>

            {/* Attractive Features */}
            <AttractiveFeatures/>

            {/* Spot & Future */}
            <div className="landing_page___spot_futures">
                <div className="mal-container">
                    <div className="landing_page___section_title">
                        Exchange & Futures
                    </div>
                    <div className="landing_page___spot_futures__content_wrapper">
                        <div className="landing_page___spot_futures__left landing_page___card">
                            <div className="mal-title__gradient">
                                Exchange
                            </div>
                            <div className="landing_page___spot_futures__description">
                                Giờ đây, 2 lệnh Limit - Market sẽ được tách riêng, giúp người dùng dễ dàng phân biệt và
                                tránh những sai sót không đáng có.
                            </div>
                            <img src="images/screen/landing-page/exchange_input.png" alt="Nami Maldives"/>
                        </div>
                        <div style={width < 992 ? { marginTop: 20 } : {}}
                             className="landing_page___spot_futures__right landing_page___card">
                            <div>
                                <div>
                                    <div className="mal-title__gradient">
                                        Lệnh mở
                                    </div>
                                    <div className="landing_page___spot_futures__description">
                                        Người dùng có thể xem lại những lệnh mình đã đặt để theo dõi biến động của tài
                                        sản và thay đổi chúng khi cần thiết.
                                    </div>
                                </div>

                                <div>
                                    <div className="mal-title__gradient">
                                        Thông tin Token
                                    </div>
                                    <div className="landing_page___spot_futures__description">
                                        Giúp người dùng cập nhật những thông tin nổi bật về token, từ đó đưa ra quyết
                                        định đầu tư hợp lý.
                                    </div>
                                </div>
                            </div>
                            <div>
                                <img src="images/screen/landing-page/ip_exchange.png" alt="Nami Maldives"/>
                            </div>
                        </div>
                    </div>

                    <div className="landing_page___spot_futures__content_wrapper">
                        <div style={width < 992 ? { marginTop: 20 } : {}}
                             className="landing_page___spot_futures__left landing_page___card">
                            <div className="mal-title__gradient">
                                Futures
                            </div>
                            <div className="landing_page___spot_futures__description">
                                Hiểu được sự thuận tiện là yếu tố cần thiết khi giao dịch, Nami Maldives đã mang lại một
                                giao diện tối giản và dễ sử dụng hơn.
                            </div>
                            <img src="images/screen/landing-page/futures_input.png" alt="Nami Maldives"/>
                        </div>
                        <div style={width < 992 ? { marginTop: 20 } : {}}
                             className="landing_page___spot_futures__right landing_page___card">
                            <div>
                                <div>
                                    <div className="landing_page___spot_futures__description">
                                        Nami Maldives mang đến cho các “Futures Trader” một tốc độ xử lý lệnh nhanh hơn
                                        so với phiên bản tiền nhiệm, đi kèm với hơn 30 bộ chỉ báo hỗ trợ người dùng
                                        trong việc nhận định và giao dịch Futures một cách hiệu quả.
                                    </div>
                                </div>
                            </div>
                            <div>
                                <img src="images/screen/landing-page/ip_futures.png" alt="Nami Maldives"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet */}
            {/*Inherit class from Section: "Experience Compare"*/}
            <div className="landing_page__wallet landing_page___exp_compare">
                <div className="landing_page___section_title mal-container">
                    Wallet
                </div>
                <div className="landing_page___exp_compare__wrapper mal-container">
                    <div className="landing_page___exp_compare__left">
                        <div className="landing_page___exp_compare__item">
                            <div className="landing_page___exp_compare__item___reason">
                                <div className="landing_page___exp_compare__item___reason__title">
                                    Nami - Old Version
                                </div>
                                <div className="landing_page___exp_compare__item___reason__item">
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Many features are restricted
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Futures and Spot wallets are not integrated yet.
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> There is no Staking and Farming wallet in Nami Exchange
                                        application.
                                    </div>
                                </div>
                            </div>
                            <img src="images/screen/landing-page/ip_wallet_left.png"
                                 alt="Nami Maldives"/>
                        </div>
                    </div>
                    <div style={width < 768 ? { marginTop: 20 } : {}} className="landing_page___exp_compare__right">
                        <div className="landing_page___exp_compare__item">
                            <div className="landing_page___exp_compare__item___reason">
                                <div className="landing_page___exp_compare__item___reason__title">
                                    Nami - Maldives M1
                                </div>
                                <div className="landing_page___exp_compare__item___reason__item">
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Exchange, Futures, Staking, Farming Wallets are integrated
                                        with one interface to help users easily tracking assets.
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> The feature to convert small balances into NAMI Token is now
                                        available in the Maldives, users can use NAMI Token to reduce transaction fees
                                        as well as receive many incentives when participating in in Nami Launchpad.
                                    </div>
                                </div>
                            </div>
                            <img src="images/screen/landing-page/ip_wallet_right.png"
                                 alt="Nami Maldives"/>
                        </div>
                    </div>
                </div>
            </div>

            {/*Payment & KYC*/}
            <PaymentAndKYC/>

            {/*And More*/}
            <div className="landing_page___more">
                <div className="landing_page___section_title text-center mal-container">
                    Và còn nhiều thay đổi sắp tới
                </div>
                <div className="mal-title__gradient">
                    Maldives M2
                </div>
                <div className="landing_page___more___subtitle">
                    sẽ được cập nhật vào tháng 11
                </div>
                <div className="landing_page___more___wrapper mal-container">
                    <img src="images/screen/landing-page/ip_more_1.png" alt="Nami Maldives"/>
                    <img src="images/screen/landing-page/ip_more_2.png" alt="Nami Maldives"/>
                </div>
            </div>
        </MadivesLayout>
    )
}

export default LandingPage
