import React, { useMemo, useState } from 'react';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import { ArrowLeft, Search, X } from 'react-feather';
import Chip from 'components/common/V2/Chip';
import InputV2 from 'components/common/V2/InputV2';
import { useTranslation } from 'next-i18next';
import AssetLogo from 'components/wallet/AssetLogo';
import { filterSearch, formatNumber, getSymbolObject } from 'redux/actions/utils';
import NoData from 'components/common/V2/TableV2/NoData';
import useDebounce from 'hooks/useDebounce';

const DEBOUNCE_TIME = 300

const InsuranceRuleModal = ({ insuranceRules, visible, onClose = () => {} }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState();
    const debounceSearch = useDebounce(search, DEBOUNCE_TIME);

    const searchRules = useMemo(() => {
        return filterSearch(insuranceRules, ['symbol'], debounceSearch);
    }, [insuranceRules, debounceSearch]);

    return (
        <ModalV2 canBlur={false} closeButton={false} className="!max-w-[800px]" isVisible={visible} onBackdropCb={onClose}>
            <div className="flex items-center justify-between">
                <ArrowLeft className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
                <X className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
            </div>
            <div className="my-6 font-semibold text-2xl">{t('futures:insurance:rules')}</div>
            {/* <div className="overflow-x-auto flex space-x-3">
                <Chip selected>VNDC</Chip>
                <Chip>USDT</Chip>
            </div> */}
            <div className="mt-6">
                <InputV2
                    prefix={<Search color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" size={16} />}
                    placeholder={t('common:search')}
                    value={search}
                    onChange={setSearch}
                    classNameDivInner="!border-none"
                />
            </div>
            <div className="h-[calc(90vh-324px)] overflow-y-auto -mx-8 px-8">
                {searchRules.length ? (
                    <div className="grid grid-cols-2 gap-4">
                        {searchRules.map((rule) => {
                            return <RuleItem key={rule?.symbol} rule={rule} />;
                        })}
                    </div>
                ) : (
                    <div className="h-full flex justify-center items-center">
                        <NoData isSearch />
                    </div>
                )}
            </div>
        </ModalV2>
    );
};

const RuleItem = ({ rule }) => {
    const { t } = useTranslation();
    const symbolObject = getSymbolObject(rule?.symbol);

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark border dark:border-none border-divider rounded-xl p-4">
            <div className="flex space-x-2 items-center mb-2">
                <AssetLogo assetCode={symbolObject?.baseAsset} useNextImg />
                <span className="font-semibold">{rule?.symbol}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:max_leverage')} </span>
                <span className="font-semibold">{rule?.max_leverage}x</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:insurance:difference')} </span>
                <span className="font-semibold">{formatNumber(rule?.avg_changing * 100, 2)}%</span>
            </div>
        </div>
    );
};

export default InsuranceRuleModal;
