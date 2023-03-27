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
import { API_UPLOAD_IMAGE_SERVER_DW, API_UPLOAD_IMAGE_S3 } from 'redux/actions/apis';
import axios from 'axios';
import fetchApi from 'utils/fetch-api';

const MODE = {
    USER: 'user',
    PARTNER: 'partner'
};

const ModalUploadImage = ({ isVisible, onClose, className, isReselect = false, mode = MODE.USER }) => {
    const { t } = useTranslation();
    const [fileImage, setFileImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

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

    const onConfirm = async () => {
        try {
            const formData = new FormData();
            formData.append('file', fileImage.raw[0]);

            setIsUploading(true);
            const resUpload = await fetchApi({
                url: API_UPLOAD_IMAGE_S3,
                options: { method: 'POST' },
                params: {
                    image: fileImage.raw[0]
                }
            });

            if (resUpload.data) {
                const res = await fetchApi({
                    url: API_UPLOAD_IMAGE_SERVER_DW,
                    options: { method: 'POST' },
                    params: {
                        image: 'https://nami-dev.sgp1.digitaloceanspaces.com/upload/deposit-withdraw/1234-NeLuSJZULqGl.jpeg',
                        displayingId: '191APL',
                        mode: mode
                    }
                });
            }

            setIsUploading(false);

            // const res = await axios({
            //     method: 'post',
            //     url: API_UPLOAD_IMAGE,
            //     data: formData,
            //     headers: { 'Content-Type': 'multipart/form-data' }
            // });

            console.log('res: ', res);
        } catch (error) {
            console.log('Cannot upload file image: ', error);
        }
    };

    const reselect = () => {
        setFileImage(null);
    };

    return (
        <ModalV2
            isVisible={isVisible}
            // isVisible={true}
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
                {isReselect && fileImage?.src && (
                    <ButtonV2 variants="secondary" onClick={reselect}>
                        {t('profile:reselect')}
                    </ButtonV2>
                )}

                {!isReselect && fileImage?.src && (
                    <>
                        <ButtonV2 loading={isUploading} onClick={onConfirm}>
                            {t('common:confirm')}
                        </ButtonV2>
                        <ButtonV2 disabled={isUploading} variants="secondary" onClick={reselect}>
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
