import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import Image from 'next/image';
import { getS3Url, saveFile } from 'redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import DomToImage from 'dom-to-image';
import { useTranslation } from 'next-i18next';
import { UploadAvatar } from 'components/screens/Account/AccountAvatar';
import styled from 'styled-components';

const ModalUploadImage = ({ isVisible, onClose, className, isReselect = true }) => {
    const { t } = useTranslation();
    const [fileImage, setFileImage] = useState(null);

    const onDropCustomAvatar = (images) => {
        if (!images || !images?.length) return;
        let file = images[0];
        const reader = new FileReader();
        // Set preview data
        reader.onload = (event) => {
            setFileImage({
                raw: images, // Init file to upload
                src: event?.target?.result
            });
            // setOpenConfirmModal(true);
        };
        reader.readAsDataURL(file);
    };

    const onConfirm = () => {
        // Confirm upload image call API
    };

    const reselect = () => {
        setFileImage(null);
    };

    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            <h1 className="txtPri-3 font-semibold mb-8">{t('profile:or_upload_image')}</h1>
            <DashBorder className="h-[418px] flex justify-center items-center flex-col">
                {fileImage ? (
                    <img className="mx-auto object-contain max-h-full max-w-full py-6" src={fileImage?.src} alt="Transfer confirm image" />
                ) : (
                    <UploadAvatar className="!bg-none" t={t} onDropCustomAvatar={onDropCustomAvatar} />
                )}
            </DashBorder>

            <div className="space-y-3 mt-8">
                {!isReselect && fileImage?.src && (
                    <ButtonV2 variants="secondary" onClick={reselect}>
                        {t('profile:reselect')}
                    </ButtonV2>
                )}

                {!isReselect && fileImage?.src && (
                    <>
                        <ButtonV2 onClick={onConfirm}>{t('common:confirm')}</ButtonV2>
                        <ButtonV2 variants="secondary" onClick={reselect}>
                            {t('profile:reselect')}
                        </ButtonV2>
                    </>
                )}
            </div>
        </ModalV2>
    );
};

const DashBorder = styled.div`
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%2347cc85' stroke-width='1' stroke-dasharray='5%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    // border-radius: 12px;
`;

export default ModalUploadImage;
