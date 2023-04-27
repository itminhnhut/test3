import React, { useRef, useState } from 'react';
import { ModalDownLoadImg } from './ModalQr';
import DomToImage from 'dom-to-image';
import { saveFile } from 'redux/actions/utils';
import { MODE } from '../constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import Image from 'next/image';
import { SaveAlt } from 'components/svg/SvgIcon';

const ModalPreviewProof = ({ t, isVisible, onClose, orderDetail, mode }) => {
    const content = useRef();
    const [loading, setLoading] = useState(false);

    const onDownload = async () => {
        setLoading(true);
        try {
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
                return saveFile(
                    new File([blob], `proof-img_${orderDetail?.displayingId}.png`, { type: 'image/png' }),
                    `proof-img_${orderDetail?.displayingId}.png`
                );
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const proofSrc = orderDetail?.side === SIDE.BUY ? orderDetail?.userUploadImage : orderDetail?.partnerUploadImage;

    return (
        <ModalDownLoadImg
            loading={loading}
            t={t}
            isVisible={isVisible}
            onClose={onClose}
            onDownload={onDownload}
            downloadText={
                <>
                    <span>{t('dw_partner:save_img')}</span>
                    <SaveAlt size={16} />
                </>
            }
        >
            <div className="txtPri-3 mb-8">Bằng chứng giao dịch</div>

            <img ref={content} src={proofSrc} className="px-10 text-center max-h-80 md:max-h-128 w-full object-contain" />
        </ModalDownLoadImg>
    );
};

export default ModalPreviewProof;
