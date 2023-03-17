import React, { useState } from 'react';
import Card from './components/common/Card';
import PartnerInfo from './components/PartnerInfo';

import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import BankInfo from './components/BankInfo';

const CardPartner = () => {
    const dispatch = useDispatch();

    const { selectedPartner, partners, assetId, input } = useSelector((state) => state.withdrawDeposit);
    const [debounceQuantity, setDebouncedQuantity] = useState('');

    useDebounce(
        () => {
            setDebouncedQuantity(input);
        },
        500,
        [input]
    );

    return (
        <Card className="min-h-[300px] ">
            <div className="txtSecond-2 mb-4">Thông tin thanh toán</div>
            <div className="space-y-4">
                <PartnerInfo selectedPartner={selectedPartner} partners={partners} assetId={assetId} debounceQuantity={debounceQuantity} />
                {selectedPartner && <BankInfo selectedPartner={selectedPartner} />}
            </div>
        </Card>
    );
};

export default CardPartner;
