import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import Image from 'next/image';
import { getS3Url, saveFile } from 'redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import DomToImage from 'dom-to-image';

const getImageQrUrl = ({ bankCode: BANK_ID, accountNumber: ACCOUNT_NO, TEMPLATE = 'qr_only', amount: AMOUNT, note: DESCRIPTION, accountName: ACCOUNT_NAME }) =>
    `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;

const ModalQr = ({ isVisible, onClose, qrCodeUrl, bank, className, amount }) => {
    const [currentTheme] = useDarkMode();

    const [downloading, setDownloading] = useState(false);
    const content = useRef(null);

    const onDownLoad = async () => {
        try {
            setDownloading(true);

            const scale = 2;
            const option = {
                height: content.current.offsetHeight * scale,
                width: content.current.offsetWidth * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left',
                    width: content.current.offsetWidth + 'px',
                    height: content.current.offsetHeight + 'px'
                }
            };
            await DomToImage.toBlob(content.current, option).then((blob) => {
                return saveFile(new File([blob], `qrCode.png`, { type: 'image/png' }), `qrCode.png`);
            });
        } catch (error) {
            console.log(error);
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
                <div className="text-xs leading-4 text-txtSecondary dark:text-txtSecondary-dark mb-1">Chủ tài khoản</div>
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
                <div ref={content} className="h-[120px] w-[120px] bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img
                        // src="https://img.vietqr.io/image/ACB-227041949-qr_only.png?amount=10000000&addInfo=Noi dung chuyen khoan"
                        src={getImageQrUrl({ ...bank, amount })}
                        width={108}
                        height={108}
                    />
                </div>
            </div>
            <ButtonV2 onClick={onDownLoad} disabled={downloading} loading={downloading}>
                Tải mã QR
            </ButtonV2>
        </ModalV2>
    );
};

export default ModalQr;
