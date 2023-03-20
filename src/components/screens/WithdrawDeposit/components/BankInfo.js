import React, { useState } from 'react';
import InfoCard from './common/InfoCard';

import { setBank } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import DropdownCard from './DropdownCard';
import TagV2 from 'components/common/V2/TagV2';

const BankInfo = ({ loadingBanks, loading, banks, containerClassname, selectedBank, onSelect }) => {
    const [search, setSearch] = useState('');
    return (
        <DropdownCard
            containerClassname={containerClassname}
            loading={loadingBanks || loading}
            label="Phương thức thanh toán"
            imgSize={40}
            data={
                banks &&
                banks.filter((bank) => bank.bankName.toLowerCase().includes(search.toLowerCase()) || bank.bankKey.toLowerCase().includes(search.toLowerCase()))
            }
            search={search}
            setSearch={setSearch}
            onSelect={(bank) => onSelect && onSelect?.(bank)}
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
                                        {item.isDefault && (
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
