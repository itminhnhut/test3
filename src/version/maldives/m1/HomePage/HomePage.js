import HomeIntroduce from 'version/maldives/m1/HomePage/HomeIntroduce'
import HomeMarketTrend from 'version/maldives/m1/HomePage/HomeMarketTrend'
import HomeAdditional from 'version/maldives/m1/HomePage/HomeAdditional'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import HomeNews from 'version/maldives/m1/HomePage/HomeNews'
import Modal from 'components/common/Modal'

import { useCallback, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { QRCode } from 'react-qrcode-logo'
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar'

const APP_URL = process.env.APP_URL || 'https://nami.exchange'

const HomePage = () => {
    // * Initial State
    const [state, set] = useState({
        showQR: false
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    // * Use Hooks
    const { t } = useTranslation(['home', 'modal'])

    // * Render Handler
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
        <MaldivesLayout navOverComponent navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="homepage">
                <HomeIntroduce parentState={setState}/>
                <HomeMarketTrend/>
                <HomeNews/>
                <HomeAdditional parentState={setState}/>
                {renderQrCodeModal()}
            </div>
        </MaldivesLayout>
    )
}

export default HomePage
