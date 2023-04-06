import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { getS3Url, saveFile } from 'redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import DomToImage from 'dom-to-image';
import { QRCode } from 'react-qrcode-logo';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_BANK_AVAILABLE } from 'redux/actions/apis';

// const getImageQrUrl = ({ bankCode: BANK_ID, accountNumber: ACCOUNT_NO, TEMPLATE = 'qr_only', amount: AMOUNT, note: DESCRIPTION, accountName: ACCOUNT_NAME }) =>
//     `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;

const ModalQr = ({ isVisible, onClose, qrCodeUrl, bank, className, amount, t }) => {
    const [currentTheme] = useDarkMode();

    const [downloading, setDownloading] = useState(false);
    const content = useRef(null);

    const { data: listBank, loading: loadingRate, error } = useFetchApi({ url: API_GET_BANK_AVAILABLE }, []);
    const bankLogo = listBank?.find((obj) => obj.bank_code === bank?.bankCode)?.logo || '';

    const downloadCode = () => {
        setDownloading(true);
        try {
            const canvas = document.getElementById(bank?.QR || 'QrCodeCanvasId');
            if (canvas) {
                const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                let downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `QR_Code_Transfer.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        } catch (error) {
            console.log('error when download image: ', error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <ModalV2
            isVisible={isVisible}
            // isVisible={true}
            wrapClassName=""
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            <div className="text-center mb-6">
                <div className="text-xs leading-4 text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('dw_partner:beneficiary')}</div>
                <div className="txtPri-3 mb-8">{bank?.accountName}</div>
                <div className="txtPri-3">{bank?.bankName}</div>
            </div>

            <div
                style={{
                    backgroundImage: `url(${`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`})`,
                    // backgroundImage: `url(${getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
                className="h-[180px] w-full flex justify-center items-center mb-10 rounded-xl"
            >
                <div ref={content} className="p-1 rounded-md bg-white relative">
                    <QRCode
                        id={bank?.QR || 'QrCodeCanvasId'}
                        // value="00020101021238530010A0000007270123000697043301091990012920208QRIBFTTA5303704540750000005802VN62300826CK 844LEP NGUYEN DUC TRUNG63042373"
                        value={bank?.QR}
                        size={140}
                        eyeRadius={6}
                        quietZone={2}
                        enableCORS={true}
                    />
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
            <ButtonV2 onClick={downloadCode} disabled={downloading} loading={downloading}>
                {t('dw_partner:download')}
            </ButtonV2>
        </ModalV2>
    );
};

export default ModalQr;
