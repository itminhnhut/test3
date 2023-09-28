import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

// ** Redux
import { useSelector } from 'react-redux';
import { API_LOAN_ASSETS, API_LOAN_COLLATERAL_ASSETS } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

import { LOANABLE, COLLATERAL } from 'components/screens/Lending/constants';

const initData = {
    loanAsset: {
        loanable: [],
        collateral: []
    }
};

const LendingContext = createContext();

const LendingProvider = ({ children }) => {
    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const auth = useSelector((state) => state.auth?.user);

    const [loanAsset, setLoanAsset] = useState(initData.loanAsset);

    const handleLoanAsset = () => {
        const apiLoanable = FetchApi({
            url: API_LOAN_ASSETS,
            options: {
                method: 'GET'
            }
        });
        const apiCollateral = FetchApi({
            url: API_LOAN_COLLATERAL_ASSETS,
            options: {
                method: 'GET'
            }
        });

        Promise.all([apiLoanable, apiCollateral])
            .then((data) => {
                const [rsLoanable, rsCollateral] = data || [];
                if (rsLoanable.statusCode === 200) {
                    setLoanAsset((prev) => ({ ...prev, loanable: rsLoanable?.data || [] }));
                }
                if (rsCollateral.statusCode === 200) {
                    setLoanAsset((prev) => ({ ...prev, collateral: rsCollateral?.data.result || [] }));
                }
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        if (!auth) return;
        handleLoanAsset();
    }, [auth]);

    const value = useMemo(() => ({ loanAsset, assetConfig, auth }), [loanAsset, assetConfig, auth]);

    return <LendingContext.Provider value={value}>{children}</LendingContext.Provider>;
};

const useLoanableList = () => {
    const context = useContext(LendingContext);
    if (context === undefined) {
        throw new Error('LoanableList must be used within a LendingContext');
    }
    const { loanAsset } = context;
    const loanCoin = loanAsset?.loanable?.map((item) => item.loanCoin);
    return { loanable: loanAsset.loanable, loanCoin };
};

const useCollateralList = () => {
    const context = useContext(LendingContext);
    if (context === undefined) {
        throw new Error('LoanableList must be used within a LendingContext');
    }
    const { loanAsset } = context;
    const collateralCoin = loanAsset?.collateral?.map((item) => item.collateralCoin);
    return { collateral: loanAsset.collateral, collateralCoin };
};

// ** handle data select loan asset
const handleSelectLoanAsset = (data, key, dataLoanAsset) => {
    const context = useContext(LendingContext);
    const { assetConfig } = context;

    const keyFind = key === LOANABLE ? 'loanCoin' : 'collateralCoin';
    const rs = assetConfig.reduce((prev, cur) => {
        if (data.includes(cur.assetCode)) {
            const rsByKey = dataLoanAsset?.find((f) => f?.[keyFind] === cur.assetCode);
            prev = [...prev, { config: rsByKey, ...cur }];
        }
        return prev;
    }, []);

    return rs;
};

const useAssets = () => {
    const { loanCoin, loanable } = useLoanableList();
    const { collateralCoin, collateral } = useCollateralList();
    const rsLoanable = handleSelectLoanAsset(loanCoin, LOANABLE, loanable);
    const rsCollateral = handleSelectLoanAsset(collateralCoin, COLLATERAL, collateral);

    return { assetLoanable: rsLoanable, assetCollateral: rsCollateral };
};

const useAuh = () => {
    const context = useContext(LendingContext);
    if (context === undefined) {
        throw new Error('LoanableList must be used within a LendingContext');
    }
    return context?.auth;
};

const getAssetConfig = () => {
    const context = useContext(LendingContext);
    if (context === undefined) {
        throw new Error('LoanableList must be used within a LendingContext');
    }
    const assetById = context?.assetConfig.reduce(
        (prev, cur) => {
            prev = { ...prev, [cur.id]: { ...cur } };
            return prev;
        },
        [{}]
    );
    return { assetConfig: context?.assetConfig, assetById };
};

export { LendingContext, LendingProvider, useLoanableList, useCollateralList, useAuh, useAssets, getAssetConfig };
