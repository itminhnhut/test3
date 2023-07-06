import React, { useState } from 'react';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import { ArrowLeft, Search, X } from 'react-feather';
import Chip from 'components/common/V2/Chip';
import InputV2 from 'components/common/V2/InputV2';
import { useTranslation } from 'next-i18next';

const InsuranceRuleModal = ({ visible, onClose = () => {} }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState();

    return (
        <ModalV2 canBlur={false} closeButton={false} className="!max-w-[800px]" isVisible={visible} onBackdropCb={onClose}>
            <div className="flex items-center justify-between">
                <ArrowLeft className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
                <X className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
            </div>
            <div className="my-6 font-semibold text-2xl">{t('futures:insurance:rules')}</div>
            <div className="overflow-x-auto flex space-x-3">
                <Chip selected>VNDC</Chip>
                <Chip>USDT</Chip>
            </div>
            <div className="mt-6">
                <InputV2
                    prefix={<Search color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" size={16} />}
                    placeholder={t('common:search')}
                    value={search}
                    onChange={setSearch}
                    classNameDivInner="!border-none"
                />
            </div>
            <div className="max-h-[calc(90vh-324px)] overflow-y-auto -mx-8 px-8">
                <div className="grid grid-cols-2 gap-4">
                    {new Array(12).fill(1).map((_, index) => {
                        return <RuleItem key={index} />;
                    })}
                </div>
            </div>
        </ModalV2>
    );
};

const RuleItem = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark border dark:border-none border-divider rounded-xl p-4">
            <div className="flex space-x-2 mb-2">
                <img
                    src="https://sgp1.digitaloceanspaces.com/static.nami/nami.exchange/images/coins/64/2.png"
                    width={24}
                    height={24}
                    className="flex-shrink-0 w-6 h-6 rounded-full"
                />
                <span className="font-semibold">BTC/VNDC</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:max_leverage')} </span>
                <span className="font-semibold">125x</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:insurance:difference')} </span>
                <span className="font-semibold">-90</span>
            </div>
        </div>
    );
};

export default InsuranceRuleModal;
