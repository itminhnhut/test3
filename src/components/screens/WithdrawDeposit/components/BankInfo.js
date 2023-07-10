import React, { useState } from 'react';
import InfoCard from './common/InfoCard';
import CheckCircle from 'components/svg/CheckCircle';
import { filterSearch } from 'redux/actions/utils';
import DropdownCard from './DropdownCard';
import TagV2 from 'components/common/V2/TagV2';
import Tooltip from 'components/common/Tooltip';
import classNames from 'classnames';

export const BankInfo = ({
    showTooltip = true,
    loadingBanks,
    loading,
    banks,
    containerClassname,
    selectedBank,
    onSelect,
    showTag = false,
    additionalActions,
    t,
    showDropdownIcon,
    disabled,
    mustBeShow
}) => {
    const [search, setSearch] = useState('');
    return (
        <DropdownCard
            additionalActions={additionalActions}
            containerClassname={containerClassname}
            loading={loading}
            loadingList={loadingBanks}
            showDropdownIcon={showDropdownIcon}
            disabled={disabled}
            mustBeShow={mustBeShow}
            label={
                <>
                    {showTooltip && (
                        <Tooltip place="top" effect="solid" isV3 id="payment-method-description">
                            <div className="max-w-[300px] py-3 text-sm z-50">{t('dw_partner:payment_method_description')}</div>
                        </Tooltip>
                    )}

                    <div data-tip="" className="inline-flex !cursor-default" data-for="payment-method-description" id="payment-method-description">
                        <div className={classNames({'cursor-pointer border-b border-darkBlue-5 border-dashed pb-0.5"': showTooltip })}>
                            <span>{t('dw_partner:payment_method')}</span>
                        </div>
                    </div>
                </>
            }
            data={banks && filterSearch(banks, ['bankName', 'bankKey', 'accountNumber'], search)}
            search={search}
            setSearch={setSearch}
            onSelect={onSelect ? (bank) => onSelect(bank) : undefined}
            placeholder={t('dw_partner:search_bank')}
            selected={{
                id: selectedBank?._id,
                content: selectedBank && {
                    mainContent: selectedBank?.bankName,
                    subContent: (
                        <div className="flex space-x-2 items-center">
                            <span>{selectedBank?.accountNumber}</span>
                        </div>
                    ),
                    imgSrc: selectedBank?.bankLogo
                },
                emptyContent: {
                    mainContent: t('dw_partner:bank'),
                    subContent: t('dw_partner:no_bank')
                },
                item: (item) => {
                    return (
                        <InfoCard
                            content={{
                                mainContent: item?.bankName,
                                subContent: (
                                    <div className="flex space-x-2 items-center">
                                        <span>{item?.accountNumber}</span>

                                        {showTag && item.isDefault && (
                                            <TagV2 icon={false} type="success">
                                                {t('dw_partner:default')}
                                            </TagV2>
                                        )}
                                    </div>
                                ),
                                imgSrc: item?.bankLogo
                            }}
                            endIcon={item._id === selectedBank?._id && <CheckCircle size={16} color="currentColor " />}
                            endIconPosition="center"
                        />
                    );
                }
            }}
        />
    );
};

export default React.memo(BankInfo);
