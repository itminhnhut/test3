import React, { useRef, useState } from 'react';
import { ModalDownLoadImg } from './ModalQr';

import { SIDE } from 'redux/reducers/withdrawDeposit';
import { SaveAlt } from 'components/svg/SvgIcon';
import { saveAs } from 'file-saver';
const ModalPreviewProof = ({ t, isVisible, onClose, orderDetail, mode }) => {
    const content = useRef();
    const [loading, setLoading] = useState(false);

    const proofSrc = orderDetail?.side === SIDE.BUY ? orderDetail?.userUploadImage : orderDetail?.partnerUploadImage;

    const onDownload = async () => {
        saveAs(proofSrc);
    };

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
            <div className="txtPri-3 mb-8">{t('common:proof')}</div>
            <div ref={content} className="text-center">
                <img src={proofSrc} className="px-10 max-h-80 md:max-h-128 w-full object-contain" />
            </div>
        </ModalDownLoadImg>
    );
};

export default ModalPreviewProof;
