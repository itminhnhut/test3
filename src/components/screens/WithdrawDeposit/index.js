import React from 'react';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';

const WithdrawDeposit = () => {
    console.log('aaaaaabb')
    return (
        <div>
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
