import React, { useMemo } from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import ModalOtp from './components/ModalOtp';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';

const WithdrawDeposit = () => {
    const auth = useSelector((state) => state.auth.user) || null;

    const isOpenModalKyc = useMemo(() => {
        return auth ? auth?.kyc_status !== 2 : false;
    }, [auth]);

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
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
        </div>
    );
};

export default WithdrawDeposit;
