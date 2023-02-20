import React, { useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import SwitchV2 from 'components/common/V2/SwitchV2';

const FuturesCloseOrder = ({ isVisible, onClose, order }) => {
    const { t } = useTranslation();
    const [isClosePar, setIsClosePar] = useState(false);

    return (
        <ModalV2 className="!max-w-[800px]" isVisible={isVisible} onBackdropCb={onClose}>
            <div className="flex items-center justify-between mt-4">
                <div className="text-2xl">{t('futures:close_order:title')}</div>
                <div className="flex items-center space-x-2">
                    <span className="text-txtSecondary dark:text-txtSecondary">{t('futures:mobile:adjust_margin:close_partially')}</span>
                    <SwitchV2 onChange={() => setIsClosePar(!isClosePar)} checked={isClosePar} />
                </div>
            </div>
        </ModalV2>
    );
};

export default FuturesCloseOrder;
