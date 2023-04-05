import React from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import NeedLoginV2 from 'components/common/NeedLoginV2';

const WithdrawDeposit = () => {
    return (
        <div>
            {/* <Header /> */}
            <div className="mb-20">
                <div className="flex -m-3 flex-wrap">
                    <div className="w-full md:w-1/2 flex p-3">
                        <CardInput />
                    </div>
                    <div className="w-full md:w-1/2 flex p-3">
                        <CardPartner />
                    </div>
                </div>
            </div>
            <HistoryTable />
        </div>
    );
};

export default WithdrawDeposit;
