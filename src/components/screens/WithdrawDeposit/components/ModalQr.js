import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { getS3Url, saveImg } from 'redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import { QRCode } from 'react-qrcode-logo';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_BANK_AVAILABLE } from 'redux/actions/apis';

// const getImageQrUrl = ({ bankCode: BANK_ID, accountNumber: ACCOUNT_NO, TEMPLATE = 'qr_only', amount: AMOUNT, note: DESCRIPTION, accountName: ACCOUNT_NAME }) =>
//     `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;

const ModalQr = ({ isVisible, onClose, bank, className, t, orderId }) => {
    const [currentTheme] = useDarkMode();

    const { data: listBank, loading: loadingRate, error } = useFetchApi({ url: API_GET_BANK_AVAILABLE }, []);
    const bankLogo = listBank?.find((obj) => obj.bank_code === bank?.bankCode)?.logo || '';
    const onDownload = () => {
        try {
            const canvas = document.getElementById(`react-qrcode-logo-${orderId}`);
            if (canvas) {
                const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                let downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `QR_Code_Transfer.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                console.log('QRcode: not have canvas');
            }
        } catch (error) {
            console.error('error when download image: ', error);
        }
    };
    return (
        <ModalDownLoadImg onDownload={onDownload} isVisible={isVisible} onClose={onClose} className={className} t={t}>
            <div className="text-center mb-6">
                <div className="text-xs leading-4 text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('dw_partner:beneficiary')}</div>
                <div className="txtPri-3 mb-8">{bank?.accountName}</div>
                <div className="txtPri-3">{bank?.bankName}</div>
            </div>

            <div
                style={{
                    backgroundImage: `url(${getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
                className="h-[180px] w-full flex justify-center items-center rounded-xl"
            >
                <div className="p-1 rounded-md bg-white relative">
                    <QRCode id={`react-qrcode-logo-${orderId}`} value={bank?.QR} size={140} eyeRadius={6} quietZone={2} enableCORS={true} />
                    {bankLogo && (
                        <img
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                            src={bankLogo}
                            width={24}
                            height={24}
                        />
                    )}
                </div>
            </div>
        </ModalDownLoadImg>
    );
};

export const ModalDownLoadImg = ({ loading, isVisible, onClose, onDownload, className, children, t, downloadText }) => {
    return (
        <ModalV2
            isMobile
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={onClose}
            className={classNames(`md:!max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            {children}
            <ButtonV2 loading={loading} className="mt-10" disabled={!onDownload} onClick={() => onDownload && onDownload?.()}>
                {downloadText ?? t('dw_partner:download')}
            </ButtonV2>
        </ModalV2>
    );
};

export default ModalQr;
