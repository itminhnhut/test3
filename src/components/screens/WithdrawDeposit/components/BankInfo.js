import React, { useState } from 'react';
import InfoCard from './common/InfoCard';

import { setBank } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import DropdownCard from './DropdownCard';

const BankInfo = ({ loadingBanks, loading, banks }) => {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const { selectedBank } = useSelector((state) => state.withdrawDeposit);

    return (
        <DropdownCard
            loading={loadingBanks || loading}
            label="Phương thức thanh toán"
            imgSize={40}
            data={
                banks &&
                banks.filter((bank) => bank.bankName.toLowerCase().includes(search.toLowerCase()) || bank.bankKey.toLowerCase().includes(search.toLowerCase()))
            }
            search={search}
            setSearch={setSearch}
            onSelect={(bank) => {
                dispatch(setBank(bank));
            }}
            selected={{
                id: selectedBank?._id,
                content: selectedBank && {
                    mainContent: selectedBank?.bankName,
                    subContent: <span>{selectedBank?.accountNumber}</span>,
                    imgSrc: selectedBank?.bankLogo
                },
                item: (item) => {
                    return (
                        <InfoCard
                            content={{
                                mainContent: item?.bankName,
                                subContent: <span>{item?.accountNumber}</span>,
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
