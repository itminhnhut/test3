import React from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import NeedLoginV2 from 'components/common/NeedLoginV2';

const WithdrawDeposit = () => {
    const auth = useSelector((state) => state.auth.user) || null;

    return (
        <div className="px-4 py-20">
            {auth ? (
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
                    {/* <HistoryTable /> */}
                </div>
            ) : (
                <div className="h-[480px] flex items-center justify-center">
                    <NeedLoginV2 addClass="flex items-center justify-center" />
                </div>
            )}

            <ModalNeedKyc isOpenModalKyc={auth && auth?.kyc_status !== 2} />
        </div>
    );
};

export default WithdrawDeposit;
