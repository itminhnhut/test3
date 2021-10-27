

const ThemingSystem = () => {
    return (
        <div className="landing_page___theming">
            <div className="landing_page___section_title mal-container">
                Dark Mode & Light Mode
            </div>
            <div className="landing_page___theming__wrapper mal-container">
                <div className="landing_page___theming__left">
                    <div className="landing_page___theming__item">
                        <div className="landing_page___theming__item__content">
                            <div className="landing_page___theming__item__title">
                                Light Mode
                            </div>
                            <div className="landing_page___theming__item__description">
                                The Classic interface but changes with color improvements
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
                                “The night sky in Maldives” is what to describe this interface, Dark Mode creates a professional and mysterious feelings for the user’s experience
                            </div>
                        </div>
                        <img src="images/screen/landing-page/ip_mb_theming_right.png" alt="Nami Maldives"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemingSystem
