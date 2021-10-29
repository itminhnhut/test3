import { useWindowSize } from 'utils/customHooks'
import { useCallback } from 'react'
import { useTranslation, Trans } from 'next-i18next'


const ThemingSystem = () => {
    // Use Hooks
    const { width } = useWindowSize()
    const { t } = useTranslation(['maldives'])

    // Render Handler
    const renderContent = useCallback(() => {
        let html

        if (width < 1200) {
            html = <>
                <div className="landing_page___theming__left">
                    <div className="landing_page___theming__item">
                        <div className="landing_page___theming__item__content">
                            <div className="landing_page___theming__item__title">
                                Light Mode
                            </div>
                            <div className="landing_page___theming__item__description">
                                {t('maldives:landing_page.theming.mb_light_mode')}
                            </div>
                        </div>
                        <img src="images/screen/landing-page/ip_mb_theming_left.png" alt="Nami Maldives"/>
                    </div>
                </div>
                <div className="landing_page___theming__right">
                    <div className="landing_page___theming__item">
                        <div className="landing_page___theming__item__content">
                            <div className="landing_page___theming__item__title">
                                Dark Mode
                            </div>
                            <div className="landing_page___theming__item__description">
                                {t('maldives:landing_page.theming.mb_dark_mode')}
                            </div>
                        </div>
                        <img src="images/screen/landing-page/ip_mb_theming_right.png" alt="Nami Maldives"/>
                    </div>
                </div>
            </>
        } else {
            html = <>
                <div className="landing_page___theming__left">
                    <div className="landing_page___theming__item">
                        <div>
                            <img src="images/screen/landing-page/ip_desk_theming_1.png" alt=""/>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="landing_page___theming__item__content">
                                <div className="landing_page___theming__item__title">
                                    Light Mode
                                </div>
                                <div className="landing_page___theming__item__description">
                                    <Trans>{t('maldives:landing_page.theming.mb_light_mode')}</Trans>
                                </div>
                            </div>
                            <img src="images/screen/landing-page/ip_desk_theming_2.png" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="landing_page___theming__right">
                    <div className="landing_page___theming__item">
                        <div>
                            <img src="images/screen/landing-page/ip_desk_theming_3.png" alt="" />
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="landing_page___theming__item__content">
                                <div className="landing_page___theming__item__title">
                                    Dark Mode
                                </div>
                                <div className="landing_page___theming__item__description">
                                    <Trans>{t('maldives:landing_page.theming.mb_dark_mode')}</Trans>
                                </div>
                            </div>
                            <img src="images/screen/landing-page/ip_desk_theming_4.png" alt="" />
                        </div>
                    </div>
                </div>
            </>
        }

        return html
    }, [width])

    return (
        <div className="landing_page___theming">
            <div className="landing_page___section_title mal-container">
                Dark/Light Mode
            </div>
            <div className="landing_page___theming__wrapper mal-container">
                {renderContent()}
            </div>
        </div>
    )
}

export default ThemingSystem
