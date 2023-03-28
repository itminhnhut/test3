import React, { useEffect } from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import ModalOtp from './components/ModalOtp';

const WithdrawDeposit = () => {
    return (
        <div className=" px-4 py-20">
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                <Header />
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
        </div>
    );
};

export default WithdrawDeposit;
