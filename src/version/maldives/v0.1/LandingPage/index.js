import MadivesLayout from 'components/common/layouts/MaldivesLayout'
import ScreenPresent from 'version/maldives/v0.1/LandingPage/ScreenPresent'

import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar'
import { useWindowSize } from 'utils/customHooks'
import { useTranslation } from 'next-i18next'
import ThemingSystem from 'version/maldives/v0.1/LandingPage/ThemingSystem'
import AttractiveFeatures from 'version/maldives/v0.1/LandingPage/AttractiveFeatures'
import PaymentAndKYC from 'version/maldives/v0.1/LandingPage/PaymentAndKYC'

const LandingPage = () => {
    // Use Hooks
    const { width } = useWindowSize()
    const { t } = useTranslation(['maldives'])

    return (
        <MadivesLayout navOverComponent={width >= 768}
                       navMode={NAVBAR_USE_TYPE.FLUENT}
                       navStyle={{ backgroundColor: 'rgba(21, 29, 47, 0.95)' }}>
            {/* Screen Presentation */}
            <ScreenPresent/>

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
                                    Nami - Old Version
                                </div>
                                <div className="landing_page___exp_compare__item___reason__item">
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Processing speed is not optimal when the number of trading
                                        pairs increases above 400 pairs
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> The order transfer system is blocked when the number of
                                        users increases rapidly
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Not having Dark Mode - which save battery for user’s phone
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> The Wallet system is not optimized
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
                                        <span>&bull;</span> Increase order processing speed by 3 times with more than
                                        500 trading pairs
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Equipped a system that automatically expands the
                                        infrastructure when the user’s number increases
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Released Dark Mode - improves the battery life by 30%
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> The user's security system is improved
                                    </div>
                                    <div className="flex flex-row">
                                        <span>&bull;</span> Optimizing the experience to reduce operations by 50%.
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

            {/* Portfolio */}
            <div className="landing_page___portfolio">

            </div>

            {/* Spot & Future */}
            <div className="landing_page___spot_&_futures">

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

            </div>
        </MadivesLayout>
    )
}

export default LandingPage
