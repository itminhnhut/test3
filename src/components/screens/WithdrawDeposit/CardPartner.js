import React, { useEffect, useState } from 'react';
import { API_GET_PARTNER_BANKS, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';
import { getPartners, setBank } from 'redux/actions/withdrawDeposit';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import BankInfo from './components/BankInfo';
import useFetchApi from 'hooks/useFetchApi';
import axios from 'axios';
import Card from './components/common/Card';
import PartnerInfo from './components/PartnerInfo';
import { useRouter } from 'next/router';

const CardPartner = () => {
    const { selectedPartner, partners, assetId, input, selectedBank } = useSelector((state) => state.withdrawDeposit);
    const [debounceQuantity, setDebouncedQuantity] = useState('');
    const [loadingPartners, setLoadingPartners] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const side = router.query?.side;

    useEffect(() => {
        setLoadingPartners(true);
    }, [input]);

    useDebounce(
        () => {
            setDebouncedQuantity(input);
        },
        500,
        [input]
    );

    useEffect(() => {
        const source = axios.CancelToken.source();
        dispatch(
            getPartners({
                params: { quantity: !debounceQuantity ? 0 : debounceQuantity, assetId, side },
                cancelToken: source.token,
                callbackFn: () => {
                    setLoadingPartners(false);
                }
            })
        );

        return () => source.cancel();
    }, [debounceQuantity, assetId, side]);

    const {
        data: banks,
        loading: loadingBanks,
        error
    } = useFetchApi({ url: API_GET_PARTNER_BANKS, params: { partnerId: selectedPartner?.partnerId } }, Boolean(selectedPartner), [
        debounceQuantity,
        assetId,
        selectedPartner
    ]);

    const { data: accountBanks, loading: loadingAccBanks } = useFetchApi({ url: API_GET_USER_BANK_ACCOUNT }, side === SIDE.SELL, [side]);

    useEffect(() => {
        if (accountBanks && accountBanks.length) {
            dispatch(setBank(accountBanks.find((bank) => bank.isDefault)));
        }
    }, [accountBanks]);

    return (
        <Card className="min-h-[444px] ">
            <div className="txtSecond-2 mb-4">Thông tin thanh toán</div>
            <div className="space-y-4">
                {side === SIDE.SELL && <BankInfo selectedBank={selectedBank} containerClassname="z-[42]" banks={accountBanks} loading={loadingAccBanks} />}

                <PartnerInfo loadingPartners={loadingPartners} selectedPartner={selectedPartner} partners={partners} />
                {side === SIDE.BUY && selectedPartner && (
                    <BankInfo
                        selectedBank={selectedBank}
                        onSelect={(bank) => dispatch(setBank(bank))}
                        banks={banks}
                        loading={loadingBanks || loadingPartners}
                        containerClassname="z-40"
                    />
                )}
            </div>
        </Card>
    );
};

export default CardPartner;
