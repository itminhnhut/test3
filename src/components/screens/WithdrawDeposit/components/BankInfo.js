import React, { useEffect, useRef, useState } from 'react';
import ChevronDown from 'components/svg/ChevronDown';
import InfoCard from './common/InfoCard';
import { ApiStatus } from 'redux/actions/const';
import FetchApi from 'utils/fetch-api';
import { API_GET_PARTNER_BANKS } from 'redux/actions/apis';
import { setBank } from 'redux/actions/withdrawDeposit';
import axios from 'axios';
import CheckCircle from 'components/svg/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import DropdownCard from './DropdownCard';

const useFetchApi = ({ url = '', params }, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async () => {
            try {
                setLoading(true);
                const data = await FetchApi({ url, cancelToken: source.token, params });
                if (data && data?.status === ApiStatus.SUCCESS) {
                    setData(data.data);
                } else {
                    setData(null);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        })();
        return () => source.cancel();
    }, dependencies);

    return { data, loading, error };
};

const BankInfo = ({ selectedPartner }) => {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const { selectedBank } = useSelector((state) => state.withdrawDeposit);

    const {
        data: banks,
        loading: loadingBanks,
        error
    } = useFetchApi({
        url: API_GET_PARTNER_BANKS,
        params: {
            partnerId: selectedPartner?.partnerId
        }
    });

    return (
        <DropdownCard
            loading={loadingBanks}         
            label="Phương thức thanh toán"
            imgSize={40}
            data={banks}
            search={search}
            setSearch={setSearch}
            onSelect={(bank) => {
                dispatch(setBank(bank));
            }}
            selected={{
                id: selectedBank?._id,
                content: selectedBank && {
                    mainContent: selectedBank?.bankName,
                    subContent: <span>{selectedBank?.accountNumber}</span>,
                    imgSrc: selectedBank?.bankLogo
                },
                item: (item) => {
                    return (
                        <InfoCard
                            content={{
                                mainContent: item?.bankName,
                                subContent: <span>{item?.accountNumber}</span>,
                                imgSrc: item?.bankLogo
                            }}
                            endIcon={item._id === selectedBank?._id && <CheckCircle size={16} color="currentColor " />}
                            endIconPosition="center"
                            imgSize={40}
                        />
                    );
                }
            }}
        />
    );
};

export default BankInfo;
