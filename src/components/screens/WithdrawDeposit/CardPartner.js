import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { API_GET_PARTNER_BANKS, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';
import { getPartner, setAccountBank, setPartnerBank } from 'redux/actions/withdrawDeposit';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useDispatch, useSelector } from 'react-redux';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import useFetchApi from 'hooks/useFetchApi';
import axios from 'axios';
import Card from './components/common/Card';

const ModalBankDefault = dynamic(() => import('./components/ModalBankDefault'), { ssr: false });
const PartnerInfo = dynamic(() => import('./components/PartnerInfo'), { ssr: false });
const BankInfo = dynamic(() => import('./components/BankInfo'), { ssr: false });

const CardPartner = () => {
    const { partner, partnerBank, accountBank, input, loadingPartner } = useSelector((state) => state.withdrawDeposit);
    const dispatch = useDispatch();
    const router = useRouter();
    const { side, assetId } = router.query;
    const [visibleModalBank, setVisibleModalBank] = useState(false);
    const [refetchAccBanks, setRefetchAccBanks] = useState(false);

    const toggleRefetchAccBanks = () => setRefetchAccBanks((prev) => !prev);

    const {
        data: banks,
        loading: loadingBanks,
        error
    } = useFetchApi({ url: API_GET_PARTNER_BANKS, params: { partnerId: partner?.partnerId } }, Boolean(partner) && side === SIDE.BUY, [
        input,
        assetId,
        partner
    ]);

    const { data: accountBanks, loading: loadingAccountBanks } = useFetchApi({ url: API_GET_USER_BANK_ACCOUNT }, side === SIDE.SELL, [side, refetchAccBanks]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        dispatch(
            getPartner({
                params: { quantity: !input ? 0 : input, assetId, side },
                cancelToken: source.token
            })
        );

        return () => source.cancel();
    }, [input, assetId, side]);

    useEffect(() => {
        if (accountBanks && accountBanks.length) {
            dispatch(setAccountBank(accountBanks.find((bank) => bank.isDefault)));
        }
    }, [accountBanks]);

    const accountBankAction = useMemo(
        () => (
            <div className="mt-6 px-4 space-y-3">
                <ButtonV2 className="text-base font-semibold">Thêm tài khoản ngân hàng</ButtonV2>
                <ButtonV2 onClick={() => setVisibleModalBank(true)} variants="text" className="text-base font-semibold">
                    Chỉnh sửa mặc định
                </ButtonV2>
            </div>
        ),
        []
    );

    return (
        <>
            <Card className="min-h-[444px] ">
                <div className="txtSecond-2 mb-4">Thông tin thanh toán</div>
                <div className="space-y-4">
                    {side === SIDE.SELL && (
                        <BankInfo
                            additionalActions={accountBankAction}
                            showTag
                            selectedBank={accountBank}
                            containerClassname="z-[42]"
                            banks={accountBanks}
                            loading={loadingAccountBanks}
                            showTooltip={false}
                        />
                    )}

                    <PartnerInfo quantity={input} assetId={assetId} side={side} loadingPartner={loadingPartner} selectedPartner={partner} />
                    {side === SIDE.BUY && partner && (
                        <BankInfo
                            selectedBank={partnerBank}
                            onSelect={(bank) => dispatch(setPartnerBank(bank))}
                            banks={banks}
                            loading={loadingBanks || loadingPartner}
                            containerClassname="z-40"
                        />
                    )}
                </div>
            </Card>
            <ModalBankDefault
                banks={accountBanks}
                toggleRefetch={toggleRefetchAccBanks}
                onClose={() => setVisibleModalBank(false)}
                isVisible={visibleModalBank}
            />
        </>
    );
};

export default CardPartner;
