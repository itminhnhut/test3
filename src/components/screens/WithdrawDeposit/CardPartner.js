import React, { useEffect, useState } from 'react';
import { API_GET_PARTNER_BANKS, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';
import { getPartners, setAccountBank, setPartnerBank } from 'redux/actions/withdrawDeposit';
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
    const { partner, partnerBank, accountBank, assetId, input } = useSelector((state) => state.withdrawDeposit);
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
    } = useFetchApi({ url: API_GET_PARTNER_BANKS, params: { partnerId: partner?.partnerId } }, Boolean(partner), [debounceQuantity, assetId, partner]);

    const { data: accountBanks, loading: loadingAccountBanks } = useFetchApi({ url: API_GET_USER_BANK_ACCOUNT }, side === SIDE.SELL, [side]);

    useEffect(() => {
        if (accountBanks && accountBanks.length) {
            dispatch(setAccountBank(accountBanks.find((bank) => bank.isDefault)));
        }
    }, [accountBanks]);

    return (
        <Card className="min-h-[444px] ">
            <div className="txtSecond-2 mb-4">Thông tin thanh toán</div>
            <div className="space-y-4">
                {side === SIDE.SELL && <BankInfo selectedBank={accountBank} containerClassname="z-[42]" banks={accountBanks} loading={loadingAccountBanks} />}

                <PartnerInfo loadingPartners={loadingPartners} selectedPartner={partner} partners={[]} />
                {side === SIDE.BUY && partner && (
                    <BankInfo
                        selectedBank={partnerBank}
                        onSelect={(bank) => dispatch(setPartnerBank(bank))}
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
