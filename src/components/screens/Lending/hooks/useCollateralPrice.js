import useFetchApi from 'hooks/useFetchApi';
import React from 'react';
import { API_GET_PAIR_PRICE } from 'redux/actions/apis';

const useCollateralPrice = ({ collateral, loanable, refetch }) => {
    let symbol = collateral?.assetCode + loanable?.assetCode;
    const { data, loading, error } = useFetchApi({ url: `${API_GET_PAIR_PRICE}/${symbol}` }, Boolean(symbol), [collateral, loanable, refetch]);

    return {
        data: data?.lastPrice,
        loading,
        error: JSON.stringify(error)
    };
};

export default useCollateralPrice;
