import React, { useState } from 'react';
import InfoCard from './common/InfoCard';
import CheckCircle from 'components/svg/CheckCircle';
import { filterSearch } from 'redux/actions/utils';
import DropdownCard from './DropdownCard';
import TagV2 from 'components/common/V2/TagV2';

const BankInfo = ({ loadingBanks, loading, banks, containerClassname, selectedBank, onSelect, showTag = false }) => {
    const [search, setSearch] = useState('');
    return (
        <DropdownCard
            containerClassname={containerClassname}
            loading={loadingBanks || loading}
            label="Phương thức thanh toán"
            imgSize={40}
            data={banks && filterSearch(banks, ['bankName', 'bankKey'], search)}
            search={search}
            setSearch={setSearch}
            onSelect={onSelect ? (bank) => onSelect(bank) : undefined}
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
                                                Mặc định
                                            </TagV2>
                                        )}
                                    </div>
                                ),
                                imgSrc: item?.bankLogo
                            }}
                            endIcon={item._id === selectedBank?._id && <CheckCircle size={16} color="currentColor " />}
                            endIconPosition="center"
                            imgSize={40}
                        />
                    );
                }
            }}
        />
    );
};

export default React.memo(BankInfo);
