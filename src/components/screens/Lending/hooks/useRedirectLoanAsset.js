import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const DEFAULT_LOAN_ASSET = 'USDT';

const useRedirectLoanAsset = ({ loanAssetList }) => {
    const router = useRouter();
    const loanAsset = router.query.loanAsset;

    const setLoanAsset = (loanAsset) => {
        const query = new URLSearchParams({ ...router.query, loanAsset });
        if (!loanAsset) {
            query.delete('loanAsset');
        }
        return router.replace({ pathname: router.pathname, query: query.toString() }, undefined, { shallow: true });
    };

    useEffect(() => {
        const checkIfLoanAssetExist = () => {
            if (!loanAsset) return;
            const isExist = loanAssetList.find((asset) => asset?.loanCoin === loanAsset);
            if (!isExist) {
                setLoanAsset(DEFAULT_LOAN_ASSET);
            }
        };
        checkIfLoanAssetExist();
    }, [loanAssetList, loanAsset]);

    return { loanAsset, setLoanAsset };
};

export default useRedirectLoanAsset;
