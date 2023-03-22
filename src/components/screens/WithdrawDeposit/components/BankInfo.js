import React, { useState } from 'react';
import InfoCard from './common/InfoCard';
import CheckCircle from 'components/svg/CheckCircle';
import { filterSearch } from 'redux/actions/utils';
import DropdownCard from './DropdownCard';
import TagV2 from 'components/common/V2/TagV2';
import Tooltip from 'components/common/Tooltip';

const BankInfo = ({ loadingBanks, loading, banks, containerClassname, selectedBank, onSelect, showTag = false, additionalActions }) => {
    const [search, setSearch] = useState('');
    return (
        <DropdownCard
            additionalActions={additionalActions}
            containerClassname={containerClassname}
            loading={loadingBanks || loading}
            label={
                <>
                    <Tooltip place="top" effect="solid" isV3 id="payment-method-description">
                        <div className="max-w-[300px] py-3 text-sm z-50">
                            Số tiền cần chuyển phải được chuyển vào tài khoản của đối tác trong vòng 15 phút kể từ khi xác nhận để giao dịch được diễn ra thành
                            công.
                        </div>
                    </Tooltip>
                    <div data-tip="" className="inline-flex" data-for="payment-method-description" id="payment-method-description">
                        <div className="nami-underline-dotted">Phương thức thanh toán</div>
                    </div>
                </>
            }
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
