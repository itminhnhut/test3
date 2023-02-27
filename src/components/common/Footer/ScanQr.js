import React from 'react';
import { QRCode } from 'react-qrcode-logo';
const APP_URL = process.env.APP_URL || 'https://nami.exchange';


const ScanQr = ({ t }) => {
    return (
        <div className="text-sm text-center w-[200px]">
            <div className="mal-footer___pocket__links___group__item__expander !justify-center mb-6">{t('navbar:down_with_qr')}</div>
            <div className="mb-5 flex justify-center">
                <QRCode value={`${APP_URL}#nami_exchange_download_app`} eyeRadius={6} size={100} />
            </div>
            <div className="text-txtSecondary dark:text-txtTextBtn-tonal_dark">{t('navbar:scan_qr')}</div>
        </div>
    );
};

export default ScanQr;
