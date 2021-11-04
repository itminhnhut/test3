import ScreenPresentation from 'version/maldives/v0.1/LandingPage/ScreenPresentation'
import AttractiveFeatures from 'version/maldives/v0.1/LandingPage/AttractiveFeatures'
import PaymentAndKYC from 'version/maldives/v0.1/LandingPage/PaymentAndKYC'
import ThemingSystem from 'version/maldives/v0.1/LandingPage/ThemingSystem'
import MadivesLayout from 'components/common/layouts/MaldivesLayout'
import Modal from 'components/common/Modal'
import {default as MobileScreenPresent } from 'version/maldives/v0.1/LandingPage/ScreenPresent'

import colors from 'styles/colors'
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar'
import { useWindowSize } from 'utils/customHooks'
import { useTranslation } from 'next-i18next'
import { useCallback, useState } from 'react'
import { getS3Url } from 'redux/actions/utils'
import { QRCode } from 'react-qrcode-logo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nami.exchange'

const LandingPage = () => {
    // Initial State
    const [state, set] = useState({
        showQR: false
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const { width } = useWindowSize()
    const { t, i18n: { language } } = useTranslation(['maldives'])

    const renderQrCodeModal = useCallback(() => {
        return (
            <Modal isVisible={state.showQR}
                   title={t('modal:scan_qr_to_download')}
                   type="confirm-one-choice"
                   positiveLabel={t('common:cancel')}
                   onConfirmCb={() => setState({ showQR: false })}
                   onBackdropCb={() => setState({ showQR: false })}>
                <div className="flex items-center justify-center">
                    <QRCode value={`${APP_URL}#nami_exchange_download_app`} size={128}/>
                </div>
            </Modal>
        )
    }, [state.showQR])

    return (
        <MadivesLayout
            light
            navName="maldives_landingpage"
            navMode={NAVBAR_USE_TYPE.FLUENT}
            navStyle={{
                backgroundColor: colors.darkBlue2
            }}
        >
            {renderQrCodeModal()}
            <div className="text-textPrimary">
                {/* Screen Presentation */}
                {width < 992 ? <MobileScreenPresent parentState={setState}/>
                    : <ScreenPresentation parentState={setState}/>}

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
                                <img src={getS3Url(`/images/screen/landing-page/ip_compare_left_${language}.png`)}
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
                                <img src={getS3Url(`/images/screen/landing-page/ip_compare_right_${language}.png`)}
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
                                    {t('maldives:landing_page.exchange_futures.exchange')}
                                </div>
                                <img src={getS3Url(`/images/screen/landing-page/exchange_input_${language}.png`)} alt="Nami Maldives"/>
                            </div>
                            <div style={width < 992 ? { marginTop: 20 } : {}}
                                 className="landing_page___spot_futures__right landing_page___card">
                                <div>
                                    <div>
                                        <div className="mal-title__gradient">
                                            {t('maldives:landing_page.exchange_futures.open_orders')}
                                        </div>
                                        <div className="landing_page___spot_futures__description">
                                            {t('maldives:landing_page.exchange_futures.open_orders_description')}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mal-title__gradient">
                                            {t('maldives:landing_page.exchange_futures.token_info')}
                                        </div>
                                        <div className="landing_page___spot_futures__description">
                                            {t('maldives:landing_page.exchange_futures.token_info_description')}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img src={getS3Url(`/images/screen/landing-page/ip_exchange_${language}.png`)} alt="Nami Maldives"/>
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
                                    {t('maldives:landing_page.exchange_futures.futures')}
                                </div>
                                <img src={getS3Url(`/images/screen/landing-page/futures_input_${language}.png`)} alt="Nami Maldives"/>
                            </div>
                            <div style={width < 992 ? { marginTop: 20 } : {}}
                                 className="landing_page___spot_futures__right landing_page___card">
                                <div>
                                    <div>
                                        <div className="landing_page___spot_futures__description">
                                            {t('maldives:landing_page.exchange_futures.futures_description')}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img src={getS3Url(`/images/screen/landing-page/ip_futures_${language}.png`)} alt="Nami Maldives"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wallet */}
                {/*Inherit class from Section: "Experience Compare"*/}
                <div className="landing_page__wallet landing_page___exp_compare">
                    <div className="landing_page___section_title mal-container">
                        {t('navbar:menu.wallet')}
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
                                            <span>&bull;</span> {t('maldives:landing_page.wallet.reason_1')}
                                        </div>
                                        <div className="flex flex-row">
                                            <span>&bull;</span> {t('maldives:landing_page.wallet.reason_2')}
                                        </div>
                                        <div className="flex flex-row">
                                            <span>&bull;</span> {t('maldives:landing_page.wallet.reason_3')}
                                        </div>
                                    </div>
                                </div>
                                <img src={getS3Url(`/images/screen/landing-page/ip_wallet_left_${language}.png`)}
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
                                            <span>&bull;</span> {t('maldives:landing_page.wallet.m_reason_1')}
                                        </div>
                                        <div className="flex flex-row">
                                            <span>&bull;</span> {t('maldives:landing_page.wallet.m_reason_2')}
                                        </div>
                                        <div className="flex flex-row">
                                            <span>&bull;</span> {t('maldives:landing_page.wallet.m_reason_3')}
                                        </div>
                                    </div>
                                </div>
                                <img src={getS3Url(`/images/screen/landing-page/ip_wallet_right_${language}.png`)}
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
                        {t('maldives:landing_page.more.title')}
                    </div>
                    <div className="mal-title__gradient">
                        Maldives M2
                    </div>
                    <div className="landing_page___more___subtitle">
                        {t('maldives:landing_page.more.subtitle')}
                    </div>
                    <div className="landing_page___more___wrapper mal-container">
                        <img src={getS3Url(`/images/screen/landing-page/ip_more_1_${language}.png`)} alt="Nami Maldives"/>
                        <img src={getS3Url(`/images/screen/landing-page/ip_more_2_${language}.png`)} alt="Nami Maldives"/>
                    </div>
                </div>
            </div>
        </MadivesLayout>
    )
}

export default LandingPage
