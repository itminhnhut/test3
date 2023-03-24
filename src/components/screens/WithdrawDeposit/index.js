import React, { useEffect } from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import OtpModal from 'components/common/OtpModal';
import ModalOtp from './components/ModalOtp';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useRouter } from 'next/router';


// const useLocationSide = () => {
//     const router = useRouter();
//     useEffect(() => {
//         let { side, assetId } = router.query;

//         if(!SIDE[side.toUpperCase()] || !)
//     }, []);
// };

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
            <HistoryTable />
        </div>
    );
};

export default WithdrawDeposit;
