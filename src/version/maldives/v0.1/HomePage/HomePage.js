import HomeIntroduce from 'version/maldives/v0.1/HomePage/HomeIntroduce'
import HomeMarketTrend from 'version/maldives/v0.1/HomePage/HomeMarketTrend'
import HomeAdditional from 'version/maldives/v0.1/HomePage/HomeAdditional'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import HomeNews from 'version/maldives/v0.1/HomePage/HomeNews'
import Modal from 'components/common/Modal'
import Image from 'next/image'
import Link from 'next/link'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useWindowSize } from 'utils/customHooks'
import { QRCode } from 'react-qrcode-logo'

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

    // useEffect(() => {
    //     console.log('namidev-DEBUG: HomePage | Watch State ', state)
    // }, [state])

    return (
        <MaldivesLayout navOverComponent navBlur>
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
