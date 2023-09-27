import { error } from 'highcharts';
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

// ** Redux
import { API_LOAN_ASSETS, API_LOAN_COLLATERAL_ASSETS } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

const initData = {
    loanAsset: {
        loanable: [],
        collateral: []
    }
};

const LendingContext = createContext();

const LendingProvider = ({ children }) => {
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
                console.log(data);
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
        handleLoanAsset();
    }, []);

    const value = useMemo(() => ({ loanAsset }), [loanAsset]);
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

export { LendingContext, LendingProvider, useLoanableList, useCollateralList };
