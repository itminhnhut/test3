import React, { useState } from 'react';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import { ArrowLeft, Search, X } from 'react-feather';
import Chip from 'components/common/V2/Chip';
import InputV2 from 'components/common/V2/InputV2';
import { useTranslation } from 'next-i18next';
import { CopyText } from 'redux/actions/utils';

const InsuranceListModal = ({ visible, onClose = () => {} }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState();

    return (
        <ModalV2 canBlur={false} closeButton={false} className="!max-w-[800px]" isVisible={visible} onBackdropCb={onClose}>
            <div className="flex items-center justify-between">
                <ArrowLeft className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
                <X className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
            </div>
            <div className="my-6 font-semibold text-2xl">{t('futures:insurance:title')}</div>
            <div className="max-h-[calc(90vh-168px)] overflow-y-auto -mx-8 px-8">
                <div className="grid grid-cols-2 gap-4">
                    {new Array(12).fill(1).map((_, index) => {
                        return <ContractItem key={index} />;
                    })}
                </div>
            </div>
        </ModalV2>
    );
};

const ContractItem = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark border dark:border-none border-divider rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">BTC</span>
                    <div className="w-0.5 h-0.5 bg-gray-1 dark:bg-gray-7 rounded-full"></div>
                    <span className="font-semibold text-green-2">VNDC</span>
                </div>
                <span className="font-semibold">200,000,000</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
                <CopyText text="22160725070001" />
                <span className="text-teal">Còn hiệu lực</span>
            </div>
            <hr className="border-divider dark:border-divider-dark my-4" />
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">Q-Claim</span>
                <span className="font-semibold">
                    2,000,000 <span className="text-green-2">(+180%)</span>
                </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">P-Claim </span>
                <span className="font-semibold">
                    2,000,000 <span className="text-green-2">(+180%)</span>
                </span>
            </div>
            <Button variants="secondary" className='mt-4'>{t('common:details')}</Button>
        </div>
    );
};

export default InsuranceListModal;
