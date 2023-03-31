import classNames from 'classnames';
import React, { useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import { UploadAvatar } from 'components/screens/Account/AccountAvatar';
import styled from 'styled-components';
import { API_UPLOAD_IMAGE_SERVER_DW, API_UPLOAD_IMAGE_S3 } from 'redux/actions/apis';
import axios from 'axios';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';

const MODE = {
    USER: 'user',
    PARTNER: 'partner'
};

const ModalUploadImage = ({ isVisible, onClose, className, mode = MODE.USER, orderId = '', originImage = '' }) => {
    if (!isVisible) return null;

    const { t } = useTranslation();
    const [fileImage, setFileImage] = useState(
        originImage
            ? {
                  raw: null, // Init file to upload
                  src: originImage
              }
            : null
    );
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
        };
        reader.readAsDataURL(file);
    };

    const onConfirm = async () => {
        setIsUploading(true);
        let isUploadFail = false;

        try {
            const formData = new FormData();
            formData.append('image', fileImage.raw[0]);

            const resUpload = await axios.post(API_UPLOAD_IMAGE_S3, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (resUpload?.data?.status === ApiStatus.SUCCESS) {
                const { status, data } = await fetchApi({
                    url: API_UPLOAD_IMAGE_SERVER_DW,
                    options: { method: 'POST' },
                    params: {
                        image: resUpload?.data?.data?.image,
                        displayingId: orderId,
                        mode: mode
                    }
                });

                if (status === ApiStatus.SUCCESS) {
                    toast({
                        text: t('dw_partner:upload_image_success'),
                        type: 'success'
                    });
                } else {
                    isUploadFail = true;
                }
            } else {
                isUploadFail = true;
            }
        } catch {
            isUploadFail = true;
        } finally {
            isUploadFail &&
                toast({
                    text: t('dw_partner:upload_image_fail'),
                    type: 'error'
                });
            setIsUploading(false);
            onClose();
        }
    };

    const reselect = () => {
        setFileImage(null);
    };

    return (
        <ModalV2
            // isVisible={true}
            isVisible={isVisible}
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            <h1 className="txtPri-3 font-semibold mb-8">{t('profile:or_upload_image')}</h1>
            <DashBorder className="h-[418px] flex justify-center items-center flex-col">
                {fileImage?.src ? (
                    <img className="mx-auto object-contain max-h-full max-w-full py-6 px-4" src={fileImage?.src} alt="Transfer confirm image" />
                ) : (
                    <UploadAvatar className="!bg-none" t={t} onDropCustomAvatar={onDropCustomAvatar} />
                )}
            </DashBorder>

            <div className="space-y-3 mt-8">
                {!!originImage &&
                    fileImage?.src &&
                    (fileImage?.raw ? (
                        <>
                            <ButtonV2 loading={isUploading} onClick={onConfirm}>
                                {t('common:confirm')}
                            </ButtonV2>
                            <ButtonV2 disabled={isUploading} variants="secondary" onClick={reselect}>
                                {t('profile:reselect')}
                            </ButtonV2>
                        </>
                    ) : (
                        <ButtonV2 variants="secondary" onClick={reselect}>
                            {t('profile:reselect')}
                        </ButtonV2>
                    ))}

                {!originImage && fileImage?.src && (
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
