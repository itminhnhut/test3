import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import Image from 'next/image';
import { getS3Url, saveFile } from 'redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import DomToImage from 'dom-to-image';

const ModalQr = ({ isVisible, onClose, qrCodeUrl, bank, className }) => {
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
            wrapClassName=""
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            <div className="text-center mb-6">
                <div className="txtPri-3 mb-1">{bank?.accountName}</div>
                <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-2">Chủ tài khoản</div>
                <div className="txtPri-3">{bank?.bankName}</div>
            </div>
            <div className="relative py-[30px] flex justify-center items-center mb-10">
                <div ref={content} className="z-10 rounded-qr-canvas">
                    {qrCodeUrl && <QRCode value={qrCodeUrl} eyeRadius={6} size={120} />}
                </div>
                <div className="absolute w-full h-full z-0">
                    <Image
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                        src={getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)}
                    />
                </div>
            </div>
            <ButtonV2 onClick={() => onDownLoad()} disabled={downloading} loading={downloading}>
                Tải mã QR
            </ButtonV2>
        </ModalV2>
    );
};

export default ModalQr;
