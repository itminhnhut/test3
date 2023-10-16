import React, { useState, useEffect, useMemo, useContext } from 'react';

// ** next
import { useTranslation } from 'next-i18next';

// ** Redux
import { useSelector } from 'react-redux';

// ** Utils
import { formatLTV, getTotalAsset } from 'components/screens/Lending/utils';
import { formatNumber } from 'utils/reference-utils';

// ** Context
import { usePairPrice, LendingContext } from 'components/screens/Lending/context';
import { globalActionTypes as actions } from 'components/screens/Lending/context/actions';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

//** components screen
import InfoMargin from './Margin/InfoMargin';
import AlertAdjust from './AlertModal/AlertAdjust.js';
import AddMarginResult from './Margin/AddMarginResult';
import SubtractMarginResult from './Margin/SubtractMarginResult';
import ConfirmAdjustMargin from './AlertModal/ConfirmAdjustMargin';
// ** svg
import { IconClose } from 'components/svg/SvgIcon';

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
    const { state, dispatchReducer } = useContext(LendingContext);
    const { getPairPrice, pairPrice } = usePairPrice();

    const { _id, amount, loanCoin, totalDebt, initialLTV, modal, totalAdjusted, collateralCoin, collateralAsset, collateralAmount, totalCollateralAmount } =
        state;

    // ** useState
    const [tab, setTab] = useState(initState.tab);
    const [error, setError] = useState(initState.error);
    const [amountAsset, setAmountAsset] = useState(initState.amountAsset);
    const debounceAmount = useDebounce(amountAsset, DEBOUNCE_TIME);

    const collateralAvailable = useSelector((state) => getSpotAvailable(state, { assetId: collateralAsset?.symbol?.id }));

    const assetLoan = useSelector((value) => getAsset(value, { assetCode: loanCoin }));
    const assetCollateralCoin = useSelector((value) => getAsset(value, { assetCode: collateralCoin }));

    const debit = useMemo(() => {
        const rs = getTotalAsset(totalDebt, assetLoan?.assetDigit);
        return { total: rs, assetCode: assetLoan?.assetCode };
    }, [totalDebt]);

    const adjust = useMemo(() => {
        const rs = getTotalAsset(totalCollateralAmount, assetCollateralCoin?.assetDigit);
        return { total: rs, assetCode: assetCollateralCoin?.assetCode };
    }, [totalCollateralAmount]);

    const current_LTV = useMemo(() => {
        const total_current_LTV = totalDebt / (totalCollateralAmount * pairPrice?.lastPrice);
        return formatLTV(total_current_LTV * PERCENT);
    }, [pairPrice?.lastPrice, _id]);

    const adjustedLTV = useMemo(() => {
        return (totalDebt / (totalAdjusted * pairPrice?.lastPrice || 0)) * PERCENT;
    }, [debounceAmount, totalAdjusted, pairPrice?.lastPrice]);

    // ** Tổng ký quỹ điều chỉnh
    const totalAmountAdjusted = useMemo(() => {
        const total = formatNumber(totalAdjusted, collateralAsset?.symbol?.assetDigit);
        const assetCode = collateralAsset?.symbol?.assetCode;
        return { total, assetCode };
    }, [totalAdjusted]);

    const dataLTV = useMemo(() => {
        const initial_LTV = formatLTV(initialLTV * PERCENT);
        const formatAdjustedLTV = formatLTV(adjustedLTV);
        return { initial: +initial_LTV, adjusted: +formatAdjustedLTV };
    }, [adjustedLTV]);

    // ** useEffect
    useEffect(() => {
        // ** reset amount
        dispatchReducer({ type: actions.RESET_AMOUNT });
        setAmountAsset(initState.amountAsset);
    }, [tab, _id]);

    useEffect(() => {
        // ** reset amount
        if (amount === '' && amountAsset !== '') {
            setAmountAsset(initState.amountAsset);
        }
        isShow && getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin }); //** get price token
    }, [isShow]);

    useEffect(() => {
        dispatchReducer({ type: actions.UPDATE_TOTAL_ADJUSTED, amount: amountAsset || 0, method: tab });
    }, [debounceAmount]);

    useEffect(() => {
        dispatchReducer({ type: actions.UPDATE_AMOUNT, amount: amountAsset });
        handleCheckAmountInput();
    }, [totalCollateralAmount, debounceAmount, adjustedLTV]);

    const handleCheckAmountInput = () => {
        let total = collateralAvailable;
        let isCheckAmount = +amountAsset < 0 || +amountAsset > total;

        if (amountAsset === '') return;

        if (tab !== TAB_ADD) {
            isCheckAmount = +amountAsset < 0 || +amountAsset > +totalCollateralAmount;
        }

        if (isCheckAmount) {
            const msg = VALIDATION_ERROR?.[tab]?.max?.[language];
            setError({ msg, type: 'max' });
            return;
        }
        if (tab === TAB_SUBTRACT) {
            if (adjustedLTV === Infinity) {
                const msg = VALIDATION_ERROR?.[tab]?.adjusted_ltv?.[language];
                setError({ msg });
                return;
            }
            if (!isCheckCurrentLTV()) {
                const msg = VALIDATION_ERROR?.[tab]?.current_ltv?.[language];
                setError({ msg });
                return;
            }
            if (!isCheckAdjustLTV()) {
                const msg = VALIDATION_ERROR?.[tab]?.adjusted_ltv?.[language];
                setError({ msg });
                return;
            }
        }
        if (!amountAsset) {
            dispatchReducer({ type: actions.RESET_AMOUNT });
        }
    };

    // ** handle
    const handleCloseModal = () => {
        onClose();
        setTab(initState.tab);
    };

    //**  handle submit form
    const handleSubmit = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CONFIRM_ADJUST }); //** open modal confirm */
        getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin }); //** update market price */
    };

    // ** handle refresh price
    const handRefreshPrice = () => {
        getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin });
    };

    //** handle */
    const handleChangeTab = (tab) => {
        setTab(tab);
    };

    // ** handle update amount assets
    const handleAmountChange = (value) => {
        error?.msg && setError(initState.error);
        setAmountAsset(value);
    };

    //** check LTV by current <-> initial
    const isCheckCurrentLTV = () => {
        const { initial } = dataLTV;
        return current_LTV < initial;
    };

    //** check LTV adjusted - initial
    const isCheckAdjustLTV = () => {
        const { adjusted, initial } = dataLTV;
        return adjusted <= initial;
    };

    const handleCloseConfirmAdjustMargin = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CONFIRM_ADJUST });
    };

    // ** validation input
    const validator = useMemo(() => {
        let msg = error?.msg || null;
        return { isValid: !Boolean(msg), msg, isError: Boolean(msg) };
    }, [error]);

    // ** handle default dash or content
    const isDefaultDash = useMemo(() => {
        return !debounceAmount || debounceAmount < 0 || adjustedLTV === Infinity || error?.type === 'max' ? DEFAULT_VALUE : false;
    }, [debounceAmount, error, adjustedLTV]);

    // ** submitted
    const isSubmitted = useMemo(() => {
        return +debounceAmount > 0 && !validator?.msg;
    }, [tab, error?.msg, debounceAmount]);

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
                            validator={validator}
                            amountAsset={amountAsset}
                            collateralCoin={collateralCoin}
                            collateralAsset={collateralAsset}
                            onChangeAmount={handleAmountChange}
                            collateralAvailable={collateralAvailable}
                        />
                    </section>
                    {tab === TAB_ADD ? (
                        <AddMarginResult
                            currentLTV={current_LTV}
                            adjustedLTV={adjustedLTV}
                            isDefaultDash={isDefaultDash}
                            totalAmountAdjusted={totalAmountAdjusted}
                        />
                    ) : (
                        <SubtractMarginResult
                            initialLTV={initialLTV}
                            currentLTV={current_LTV}
                            adjustedLTV={adjustedLTV}
                            isDefaultDash={isDefaultDash}
                            totalAmountAdjusted={totalAmountAdjusted}
                        />
                    )}
                </section>
                <ButtonV2 disabled={!isSubmitted} className="mt-10" onClick={handleSubmit}>
                    {tab === TAB_ADD ? 'Thêm ký quỹ' : 'Bớt ký quỹ'}
                </ButtonV2>
            </ModalV2>

            <ConfirmAdjustMargin
                id={_id}
                tab={tab}
                amount={amountAsset}
                initialLTV={initialLTV}
                currentLTV={current_LTV}
                adjustedLTV={adjustedLTV}
                totalAdjusted={totalAmountAdjusted}
                dispatchReducer={dispatchReducer}
                onRefreshPrice={handRefreshPrice}
                isConfirmAdjust={modal?.isConfirmAdjust}
                onCloseAdjustMargin={handleCloseConfirmAdjustMargin}
            />
            <AlertAdjust />
        </>
    );
};

export default AdjustMargin;
