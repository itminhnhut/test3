import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { DEFAULT_PARTNER_MAX, DEFAULT_PARTNER_MIN } from 'redux/actions/const';
import { getAssetCode, getExactBalanceFiat } from 'redux/actions/utils';
import { getPartner, setAllowedAmount, setInput, setLoadingPartner, setPartner } from 'redux/actions/withdrawDeposit';

const useGetPartner = ({ assetId, side, amount, rate }) => {
    const { input, loadingPartner, partner, maximumAllowed, minimumAllowed } = useSelector((state) => state.withdrawDeposit);

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

    useDebounce(
        () => {
            dispatch(setInput(amount));
        },
        500,
        [amount]
    );

    useEffect(() => {
        dispatch(setLoadingPartner(true));
    }, [amount]);

    useEffect(() => {
        let mounted = false;
        const source = axios.CancelToken.source();
        const fetchPartner = () => {
            if (+input < minimumAllowed || +input > maximumAllowed || !input) {
                dispatch(setPartner(null));

                if (loadingPartner) {
                    dispatch(setLoadingPartner(false));
                }
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
