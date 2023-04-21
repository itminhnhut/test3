import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_PARTNER_MAX, DEFAULT_PARTNER_MIN } from 'redux/actions/const';
import { getAssetCode } from 'redux/actions/utils';
import { getPartner, setAllowedAmount, setInput, setLoadingPartner, setPartner } from 'redux/actions/withdrawDeposit';

const useGetPartner = ({ assetId, side, amount, rate }) => {
    const { input, loadingPartner, maximumAllowed, minimumAllowed } = useSelector((state) => state.withdrawDeposit);

    const dispatch = useDispatch();

    const assetCode = getAssetCode(+assetId);

    useEffect(() => {
        if (rate && assetCode) {
            dispatch(
                setAllowedAmount({
                    min: Math.ceil(DEFAULT_PARTNER_MIN[side] / rate, assetCode),
                    max: Math.floor(DEFAULT_PARTNER_MAX[side] / rate, assetCode)
                })
            );
        }
    }, [rate, side, assetCode]);

    useEffect(() => {
        let timeout = setTimeout(() => {
            dispatch(setInput(amount));
        }, 200);
        if (+amount >= minimumAllowed && +amount <= maximumAllowed) {
            dispatch(setLoadingPartner(true));
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [amount, minimumAllowed, maximumAllowed]);

    useEffect(() => {
        let mounted = false;
        const source = axios.CancelToken.source();
        const fetchPartner = () => {
            if (+input < minimumAllowed || +input > maximumAllowed || !input) {
                // stop showing partner
                // set loading to false to prevent
                dispatch(setPartner(null));
                dispatch(setLoadingPartner(false));
                return;
            }
            dispatch(
                getPartner({
                    params: { quantity: !input ? 0 : +input, assetId, side },
                    cancelToken: source.token,
                    callbackFn: () => {
                        if (mounted && !loadingPartner) {
                            dispatch(setLoadingPartner(true));
                            return;
                        }
                        dispatch(setLoadingPartner(false));
                    }
                })
            );
        };
        fetchPartner();
        return () => {
            mounted = true;
            source.cancel();
        };
    }, [input, assetId, side, minimumAllowed, maximumAllowed]);
};

export default useGetPartner;
