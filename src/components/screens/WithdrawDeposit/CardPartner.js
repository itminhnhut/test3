import React, { useEffect, useState } from 'react';
import { API_GET_PARTNER_BANKS } from 'redux/actions/apis';
import { getPartners } from 'redux/actions/withdrawDeposit';
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
    const { selectedPartner, partners, assetId, input } = useSelector((state) => state.withdrawDeposit);
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
    }, [debounceQuantity, assetId]);

    const {
        data: banks,
        loading: loadingBanks,
        error
    } = useFetchApi({ url: API_GET_PARTNER_BANKS, params: { partnerId: selectedPartner?.partnerId } }, [debounceQuantity, assetId, selectedPartner]);

    return (
        <Card className="min-h-[444px] ">
            <div className="txtSecond-2 mb-4">Thông tin thanh toán</div>
            <div className="space-y-4">
                <PartnerInfo loadingPartners={loadingPartners} selectedPartner={selectedPartner} partners={partners} />
                {selectedPartner && (
                    <BankInfo
                        banks={banks}
                        loadingBanks={loadingBanks}
                        debounceQuantity={debounceQuantity}
                        assetId={assetId}
                        loading={loadingPartners}
                        selectedPartner={selectedPartner}
                    />
                )}
            </div>
        </Card>
    );
};

export default CardPartner;
