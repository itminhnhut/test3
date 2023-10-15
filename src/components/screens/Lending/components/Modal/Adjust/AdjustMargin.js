import React, { useState, useEffect, useMemo, useContext } from 'react';

// ** next
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

// ** Redux
import { dwLinkBuilder } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useSelector } from 'react-redux';

// ** Utils
import { totalAsset, formatLTV, getTotalAsset } from 'components/screens/Lending/utils';
import { formatNumber } from 'utils/reference-utils';

// ** Context
import { usePairPrice, LendingContext } from 'components/screens/Lending/context';
import { globalActionTypes as actions } from 'components/screens/Lending/context/actions';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import AssetLogo from 'components/wallet/AssetLogo';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TradingInputV2 from 'components/trade/TradingInputV2';

//** components screen
import ConfirmAdjustMargin from './AlertModal/ConfirmAdjustMargin';
import AlertAdjust from './AlertModal/AlertAdjust.js';
import InfoMargin from './Margin/InfoMargin';
import SubtractMarginResult from './Margin/SubtractMarginResult';
import AddMarginResult from './Margin/AddMarginResult';

// ** constants
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';

// ** Third party
import classNames from 'classnames';
import { createSelector } from 'reselect';
import useDebounce from 'hooks/useDebounce';
import { find } from 'lodash';
import { PERCENT } from 'components/screens/Lending/constants';
import FormInput from './Margin/FomInput';

const TAB_ADD = 'add';
const TAB_SUBTRACT = 'subtract';

const MARGIN = [
    { title: { vi: 'Thêm ký quỹ', en: 'Thêm ký quỹ' }, key: TAB_ADD },
    { title: { vi: 'Bớt ký quỹ', en: 'Bớt ký quỹ' }, key: TAB_SUBTRACT }
];

const DEFAULT_VALUE = '-';

const getSpotAvailable = createSelector([(state) => state.wallet?.SPOT, (utils, params) => params], (wallet, params) => {
    const _avlb = wallet?.[params.assetId];
    return _avlb ? Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0) : 0;
});

const DEBOUNCE_TIME = 300;

const initState = {
    tab: TAB_ADD,
    error: {},
    amountAsset: 0
};

const VALIDATION_ERROR = {
    add: {
        max: { vi: 'số lượng tài sản lớn hơn khả dụng', en: 'số lượng tài sản lớn hơn khả dụng' }
    },
    subtract: {
        max: { vi: 'số lượng tài sản lớn hơn tổng ký quỹ', en: 'số lượng tài sản lớn hơn tổng ký quỹ' },
        current_ltv: { vi: 'LTV Hiện tại lớn hơn hoặc bằng LTV ban đầu', en: 'LTV Hiện tại lớn hơn hoặc bằng LTV ban đầu' },
        adjusted_ltv: { vi: 'LTV đã điều chỉnh lớn hơn LTV hiện tại', en: 'LTV đã điều chỉnh lớn hơn LTV hiện tại' }
    }
};

const getAsset = createSelector([(state) => state?.utils?.assetConfig, (utils, params) => params], (assetConfig, params) => {
    return find(assetConfig, { ...params });
});

const AdjustMargin = ({ onClose, isShow = false }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** collateral wallet balance

    // ** useContext
    const { state } = useContext(LendingContext);
    const { getPairPrice, pairPrice } = usePairPrice();

    const { totalDebt, loanCoin, collateralCoin, collateralAmount, totalCollateralAmount, amount, totalAdjusted, collateralAsset, initialLTV } = state;

    const collateralAvailable = useSelector((state) => getSpotAvailable(state, { assetId: collateralAsset?.symbol?.id }));

    const assetLoan = useSelector((value) => getAsset(value, { assetCode: loanCoin }));
    const assetCollateralCoin = useSelector((value) => getAsset(value, { assetCode: collateralCoin }));

    const debit = useMemo(() => {
        const rs = getTotalAsset(totalDebt, assetLoan?.assetDigit);
        return { total: rs, assetCode: assetLoan?.assetCode };
    }, [totalDebt]);

    const adjust = useMemo(() => {
        const rs = getTotalAsset(collateralAmount, assetCollateralCoin?.assetDigit);
        return { total: rs, assetCode: assetCollateralCoin?.assetCode };
    }, [collateralAmount]);

    const current_LTV = useMemo(() => {
        const total_current_LTV = totalDebt / (totalCollateralAmount * pairPrice?.lastPrice);
        return formatLTV(total_current_LTV * PERCENT);
    }, [pairPrice?.lastPrice]);

    const adjustedLTV = useMemo(() => {
        return (totalDebt / (totalAdjusted * pairPrice?.lastPrice || 0)) * PERCENT;
    }, [amount, totalDebt, totalAdjusted, pairPrice?.lastPrice]);

    // ** total Tổng ký quỹ
    const totalAmountAdjusted = useMemo(() => {
        const total = formatNumber(totalAdjusted, collateralAsset?.symbol?.assetDigit);
        const assetCode = collateralAsset?.symbol?.assetCode;
        return { total, assetCode };
    }, [totalAdjusted]);

    // ** useState
    const [tab, setTab] = useState(initState.tab);
    const [error, setError] = useState(initState.error);
    const [amountAsset, setAmountAsset] = useState(initState.amountAsset);
    const debounceAmount = useDebounce(amountAsset, DEBOUNCE_TIME);

    useEffect(() => {
        // ** reset amount
        if (state.amount === '' && amountAsset !== '') {
            setAmountAsset(initState.amountAsset);
        }
        isShow && getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin }); //** get price token
    }, [isShow]);

    const handleCloseModal = () => {
        onClose();
        setTab(initState.tab);
    };

    const handleSubmit = () => {};
    const isSubmitted = () => {};

    //** handle */
    const handleChangeTab = (tab) => {
        setTab(tab);
    };

    // ** handle update amount assets
    const handleAmountChange = (value) => {
        setAmountAsset(value);
        error?.msg && setError(initState.error);
    };

    // ** validation input
    const validator = useMemo(() => {
        let msg = error?.msg || null;
        return { isValid: !Boolean(msg), msg, isError: Boolean(msg) };
    }, [error]);

    // ** handle default dash or content
    const isDefaultDash = useMemo(() => {
        return !amountAsset || amountAsset < 0 || error?.type === 'max' ? DEFAULT_VALUE : false;
    }, [amountAsset, error]);

    return (
        <>
            <ModalV2
                isVisible={isShow}
                className="w-[800px] overflow-auto no-scrollbar"
                onBackdropCb={handleCloseModal}
                wrapClassName="p-6 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={handleCloseModal}
                        >
                            <IconClose />
                        </div>
                    </div>
                )}
            >
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Điều chỉnh ký quỹ</div>
                <section className="mt-6 flex flex-row gap-6">
                    <section className="w-1/2">
                        <section className="cursor-pointer flex flex-row border rounded border-divider dark:border-divider-dark justify-between text-center bg-white dark:bg-dark">
                            {MARGIN?.map((item, key) => {
                                return (
                                    <section
                                        key={`margin_${key}_${item.title?.[language]}`}
                                        className={classNames('w-1/2 dark:text-gray-7 text-gray-1 py-3', {
                                            'dark:bg-dark-2 bg-dark-12 dark:!text-gray-4 !text-gray-15 font-semibold': item.key === tab,
                                            'border-r-[1px] border-r-divider dark:border-r-divider-dark': key === 0
                                        })}
                                        onClick={() => handleChangeTab(item.key)}
                                    >
                                        {item.title?.[language]}
                                    </section>
                                );
                            })}
                        </section>
                        <InfoMargin totalDebt={debit} totalAdjust={adjust} />
                        <FormInput
                            tab={tab}
                            collateralAvailable={collateralAvailable}
                            collateralAsset={collateralAsset}
                            collateralCoin={collateralCoin}
                            validator={validator}
                            amountAsset={amountAsset}
                            onChangeAmount={handleAmountChange}
                        />
                    </section>
                    {tab === TAB_ADD ? (
                        <AddMarginResult
                            currentLTV={current_LTV}
                            adjustedLTV={adjustedLTV}
                            totalAmountAdjusted={totalAmountAdjusted}
                            isDefaultDash={isDefaultDash}
                        />
                    ) : (
                        <SubtractMarginResult
                            isDefaultDash={isDefaultDash}
                            currentLTV={current_LTV}
                            initialLTV={initialLTV}
                            adjustedLTV={adjustedLTV}
                            totalAmountAdjusted={totalAmountAdjusted}
                        />
                    )}
                </section>
                <ButtonV2 disabled={!isSubmitted} className="mt-10" onClick={handleSubmit}>
                    {tab === TAB_ADD ? 'Thêm ký quỹ' : 'Bớt ký quỹ'}
                </ButtonV2>
            </ModalV2>

            {/* <ConfirmAdjustMargin
                tab={tab}
                amount={amountAsset}
                id={dataCollateral?._id}
                currentLTV={current_LTV}
                adjustedLTV={adjustedLTV}
                totalAdjusted={totalAdjusted}
                initialLTV={state?.initialLTV}
                onRefreshPrice={handRefreshPrice}
                dispatchReducer={dispatchReducer}
                isConfirmAdjust={modalAdjust.isConfirmAdjust}
                onCloseAdjustMargin={handleCloseConfirmAdjustMargin}
            />
            <AlertAdjust /> */}
        </>
    );
};

export default AdjustMargin;
