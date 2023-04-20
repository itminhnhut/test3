import React, { useEffect, useState } from 'react';
import Header from './components/common/Header';
import CardInput from './CardInput';
import CardPartner from './CardPartner';
import HistoryTable from './HistoryTable';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import NeedLoginV2 from 'components/common/NeedLoginV2';
import DWAddPhoneNumber from 'components/common/DWAddPhoneNumber';

const WithdrawDeposit = () => {
    const auth = useSelector((state) => state.auth.user) || null;

    const [isOpenModalAddPhone, setIsOpenModalAddPhone] = useState(false);

    useEffect(() => {
        setIsOpenModalAddPhone(!auth?.phone);
    }, [auth]);

    return (
        <>
            {auth?.phone && (
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
            )}
            <DWAddPhoneNumber isVisible={isOpenModalAddPhone} onBackdropCb={() => setIsOpenModalAddPhone(false)} />
        </>
    );
};

export default WithdrawDeposit;
