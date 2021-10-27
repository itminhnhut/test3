import { useWindowSize } from 'utils/customHooks'
import { useCallback } from 'react'

const AttractiveFeatures = () => {
    // Use Hooks
    const { width } = useWindowSize()

    // Render Handler
    const renderFunction = useCallback(() => {
        let html = null
        if (width < 768) {
            html = <>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_swap.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Swap
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_rocket.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Launchpad
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_staking.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Staking
                        </div>
                    </div>
                </div>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_farming.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Farming
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_wallet.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Wallet
                        </div>
                    </div>
                </div>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_copytrade.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Copy Trades
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_news.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            News
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src="images/icon/ic_explained.png" alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Explained
                        </div>
                    </div>
                </div>
            </>
        } else {

        }

        return (
            <div className="landing_page___attractive_features__content__right__function">
                {html}
            </div>
        )
    } ,[width])

    return (
        <div className="landing_page___attractive_features mal-container">
            <div className="landing_page___attractive_features__wrapper">
                <div className="landing_page___section_title">
                    More Attractive Features
                </div>
                <div className="landing_page___attractive_features__content">
                    <div className="landing_page___attractive_features__content__left">
                        <div className="landing_page___card">
                            <div className="landing_page___attractive_features__content__left__description">
                                The variety of products and features are optimized for users. Nami's ecosystem helps to
                                allocate capital and update knowledge quickly from the market.
                            </div>
                            <img src="images/icon/speaker.png" alt={null} />
                        </div>
                    </div>
                    <div style={width < 768 ? { marginTop: 20 } : {}}
                         className="landing_page___attractive_features__content__right">
                        <div className="landing_page___card">
                            {renderFunction()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttractiveFeatures
