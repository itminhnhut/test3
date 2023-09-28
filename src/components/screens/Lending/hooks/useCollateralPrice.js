import useFetchApi from 'hooks/useFetchApi';
import React from 'react';
import { API_GET_PAIR_PRICE } from 'redux/actions/apis';

const useCollateralPrice = ({ collateralAssetCode, loanableAssetCode, refetch }) => {
    let symbol = collateralAssetCode + loanableAssetCode;
    const { data, loading, error } = useFetchApi({ url: `${API_GET_PAIR_PRICE}/${symbol}` }, Boolean(symbol), [
        collateralAssetCode,
        loanableAssetCode,
        refetch
    ]);

    return {
        data: data?.lastPrice,
        loading,
        error: JSON.stringify(error)
    };
};

export default useCollateralPrice;
