import axios from 'axios';
import { find } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_PARTNER_MAX, DEFAULT_PARTNER_MIN } from 'redux/actions/const';
import { roundByExactDigit } from 'redux/actions/utils';
import { getPartner, setAllowedAmount, setInput, setLoadingPartner, setPartner } from 'redux/actions/withdrawDeposit';

const DEBOUNCE_TIME = 300;
const useGetPartner = ({ assetId, side, amount, rate }) => {
    const { input, loadingPartner, maximumAllowed, minimumAllowed } = useSelector((state) => state.withdrawDeposit);
    const configs = useSelector((state) => state.utils.assetConfig);
    const dispatch = useDispatch();

    const assetConfig = find(configs, { id: +assetId });
    useEffect(() => {
        if (rate && assetConfig) {
            dispatch(
                setAllowedAmount({
                    min: assetConfig?.assetCode === 'VNDC' ? DEFAULT_PARTNER_MIN[side] : 5,
                    max: roundByExactDigit(DEFAULT_PARTNER_MAX[side] / rate, assetConfig?.assetDigit)
                })
            );
        }
    }, [rate, side, assetConfig]);

    useEffect(() => {
        let timeout = setTimeout(() => {
            dispatch(setInput(amount));
        }, DEBOUNCE_TIME);
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
                        if (mounted) {
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
