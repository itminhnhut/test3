import useFetchApi from 'hooks/useFetchApi';
import { API_GET_PAIR_PRICE } from 'redux/actions/apis';

const useCollateralPrice = ({ collateralAssetCode, loanableAssetCode, refetch, dependencies = [], condition = true }) => {
    let symbol = collateralAssetCode + loanableAssetCode;
    const { data, loading, error } = useFetchApi(
        {
            url: `${API_GET_PAIR_PRICE}/${symbol}`,
            params: {
                base: collateralAssetCode,
                quote: loanableAssetCode
            }
        },
        Boolean(symbol) && condition,
        [collateralAssetCode, loanableAssetCode, refetch, ...dependencies]
    );

    return {
        data: data?.lastPrice,
        loading,
        error: JSON.stringify(error)
    };
};

export default useCollateralPrice;
