import React, { useEffect } from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import ModalOtp from './components/ModalOtp';




const WithdrawDeposit = () => {
    return (
        <div className="max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl my-20">
            <Header />
            <div className="mb-20">
                <div className="flex -m-3 flex-wrap">
                    <div className="w-full md:w-1/2 p-3">
                        <CardInput />
                    </div>
                    <div className="w-full md:w-1/2 p-3">
                        <CardPartner />
                    </div>
                </div>
            </div>
            {/* <HistoryTable /> */}
        </div>
    );
};

export default WithdrawDeposit;
