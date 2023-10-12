import React, { useState, useEffect, useMemo, useContext } from 'react';

// ** next
import { useTranslation } from 'next-i18next';

// ** Redux
import { WalletType } from 'redux/actions/const';
import { setTransferModal } from 'redux/actions/utils';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

// ** Utils
import { totalAsset, formatLTV } from 'components/screens/Lending/utils';
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
import ConfirmAdjustMargin from './ConfirmAdjustMargin';
import AlertAdjust from './AlertAdjust.js';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';

// ** Third party
import classNames from 'classnames';
import { PERCENT } from 'components/screens/Lending/constants';
import useDebounce from 'hooks/useDebounce';

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

const AdjustMargin = ({ onClose, dataCollateral = {}, isShow = false }) => {
    // ** useContext
    const { state, dispatchReducer } = useContext(LendingContext);
    const dispatch = useDispatch();
    const { getPairPrice, pairPrice } = usePairPrice();

    const amount = state.amount;
    const modalAdjust = state.modal;

    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** collateral wallet balance
    const collateralAvailable = useSelector((state) => getSpotAvailable(state, { assetId: dataCollateral?.collateralAsset?.symbol?.id }));

    //**  useState
    const [tab, setTab] = useState(initState.tab);
    const [error, setError] = useState(initState.error);
    const [amountAsset, setAmountAsset] = useState(initState.amountAsset);
    const debounceAmount = useDebounce(amountAsset, DEBOUNCE_TIME);

    const { collateralCoin, loanCoin, totalDebt, totalCollateralAmount } = dataCollateral || {};
    const total_current_LTV = totalDebt / (totalCollateralAmount * pairPrice?.lastPrice);

    const rsTotalDebt = totalAsset(totalDebt, loanCoin);
    const rsTotalCollateralAmount = totalAsset(totalCollateralAmount, collateralCoin);
    const adjustedCurrent = state?.infoCollateralAmount; // ** tổng ký quỷ ban đầu

    // ** total Tổng ký quỹ
    const totalAdjusted = useMemo(() => {
        const total = formatNumber(state?.totalAdjusted, adjustedCurrent.assetDigit);
        const assetCode = adjustedCurrent.assetCode;
        return { total, assetCode };
    }, [state?.totalAdjusted, adjustedCurrent.assetDigit]);

    // ** useMemo
    const current_LTV = useMemo(() => {
        return formatLTV(total_current_LTV * PERCENT);
    }, [pairPrice?.lastPrice, JSON.stringify(dataCollateral)]);

    const adjustedLTV = useMemo(() => {
        return (state.totalDebt / (state.totalAdjusted * pairPrice?.lastPrice || 0)) * PERCENT;
    }, [amount, state.totalDebt, state.totalAdjusted, pairPrice?.lastPrice]);

    const dataLTV = useMemo(() => {
        const initial_LTV = formatLTV(state.initialLTV * PERCENT);
        const formatAdjustedLTV = formatLTV(adjustedLTV);
        return { initial: +initial_LTV, adjusted: +formatAdjustedLTV };
    }, [state.initialLTV, adjustedLTV]);

    // ** useEffect
    useEffect(() => {
        if (dataCollateral?._id) {
            dispatchReducer({ type: actions.UPDATE, data: { dataCollateral, rsTotalDebt, rsTotalCollateralAmount } });
            // ** reset amount
            dispatchReducer({ type: actions.RESET_AMOUNT });
            setAmountAsset(initState.amountAsset);
        }
    }, [JSON.stringify(dataCollateral), tab]);

    useEffect(() => {
        // ** reset amount
        if (state.amount === '' && amountAsset !== '') {
            setAmountAsset(initState.amountAsset);
        }
        isShow && getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin }); //** get price token
    }, [isShow]);

    // ** useEffect modal Transfer
    useEffect(() => {
        if (collateralAvailable < amountAsset) {
            const msg = VALIDATION_ERROR?.[tab]?.max?.[language];
            setError({ msg, type: 'max' });
        } else {
            error?.length > 0 && setError(initState.error);
        }
    }, [collateralAvailable]);

    useEffect(() => {
        handleCheckAmountInput();
        dispatchReducer({ type: actions.UPDATE_TOTAL_ADJUSTED, amount: amountAsset || 0, method: tab });
    }, [debounceAmount, adjustedLTV]);

    // ** handle reset clear input or update amount
    const handleRestUpdateAmount = () => {
        if (!amountAsset) {
            dispatchReducer({ type: actions.RESET_AMOUNT });
            setError(initState.error);
        } else {
            dispatchReducer({ type: actions.UPDATE_AMOUNT, amount: amountAsset });
        }
    };

    // ** handle check amount < collateralAvailable || totalAdjusted (tổng ký quỷ)
    const handleCheckAmountInput = () => {
        let total = collateralAvailable;
        let isCheckAmount = +amountAsset < 0 || +amountAsset > total;

        if (tab !== TAB_ADD) {
            total = adjustedCurrent?.total;
            isCheckAmount = +amountAsset < 0 || +amountAsset > total;
        }
        if (isCheckAmount) {
            const msg = VALIDATION_ERROR?.[tab]?.max?.[language];
            setError({ msg, type: 'max' });
            return;
        }
        if (tab === TAB_SUBTRACT) {
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
        error?.msg && setError(initState.error);
        handleRestUpdateAmount();
    };

    // ** handle
    const handleTab = (tab) => {
        setTab(tab);
    };

    const handleCloseModal = () => {
        onClose();
        setTab(initState.tab);
    };

    const handleSubmit = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CONFIRM_ADJUST }); //** open modal confirm */
        getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin }); //** update market price */
    };

    const handRefreshPrice = () => {
        getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin });
    };

    // ** handle update amount assets
    const handleAmountChange = (value) => {
        setAmountAsset(value);
    };

    //* check amount - Available
    const isCheckAmountAvailable = () => {
        return amountAsset > 0 && amountAsset <= collateralAvailable;
    };

    //* check amount - adjusted current
    const isCheckAmountAdjusted = () => {
        return amountAsset > 0 && +amountAsset <= adjustedCurrent.total;
    };

    //** check LTV by current - initial
    const isCheckCurrentLTV = () => {
        const { initial } = dataLTV;
        return current_LTV < initial;
    };

    //** check LTV adjusted - initial
    const isCheckAdjustLTV = () => {
        const { adjusted, initial } = dataLTV;
        return adjusted <= initial;
    };

    //** validation subtract
    const validationSubtract = () => {
        return isCheckCurrentLTV() && isCheckAdjustLTV() && isCheckAmountAdjusted();
    };

    const isSubmitted = useMemo(() => {
        return tab === initState.tab ? isCheckAmountAvailable() : validationSubtract();
    }, [tab, debounceAmount, collateralAvailable, adjustedLTV, adjustedCurrent?.total]);

    const handleCloseConfirmAdjustMargin = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CONFIRM_ADJUST });
    };

    const validator = useMemo(() => {
        let msg = error?.msg || null;
        return { isValid: !Boolean(msg), msg, isError: Boolean(msg) };
    }, [error]);

    const isDefaultDash = useMemo(() => {
        return amountAsset < 0 || error?.type === 'max' ? DEFAULT_VALUE : false;
    }, [amountAsset, error]);

    // ** render
    const renderAddMargin = () => {
        return (
            <section className="w-1/2 dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                <section className="flex flex-col gap-3 mt-6">
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV Hiện tại</div>
                        <div className="dark:text-gray-4 font-semibold">{current_LTV}%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">{isDefaultDash || `${formatLTV(adjustedLTV)}%`}</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7 flex-wrap">
                        <div>Tổng ký quỹ điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold flex flex-row gap-1">
                            {isDefaultDash || (
                                <>
                                    <span>{totalAdjusted.total}</span>
                                    <span>{totalAdjusted.assetCode}</span>
                                </>
                            )}
                        </div>
                    </section>
                </section>
            </section>
        );
    };

    const renderSubtractMargin = () => {
        return (
            <section className="flex flex-col gap-6 w-1/2">
                <section className="dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">
                    <div className="dark:text-gray-4 text-gray-15 font-semibold">Lưu ý</div>
                    <div className="mt-6 text-gray-1 dark:text-gray-7">{`Chỉ cho phép bớt ký quỹ khi LTV < LTV ban đầu. LTV cuối cùng phải ≤ LTV ban đầu.`}</div>
                </section>
                <section className="dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">
                    <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                    <section className="flex flex-col gap-3 mt-6">
                        <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                            <div>LTV ban đầu</div>
                            <div className="dark:text-gray-4 font-semibold">{state?.initialLTV * PERCENT}%</div>
                        </section>
                        <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                            <div>LTV Hiện tại</div>
                            <div className="dark:text-gray-4 font-semibold">{current_LTV}%</div>
                        </section>
                        <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                            <div>LTV đã điều chỉnh</div>
                            <div className="dark:text-gray-4 font-semibold">{isDefaultDash || `${formatLTV(adjustedLTV)}%`} </div>
                        </section>
                        <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7 flex-wrap">
                            <div>Tổng ký quỹ điều chỉnh</div>
                            <div className="dark:text-gray-4 font-semibold flex flex-row gap-1">
                                {isDefaultDash || (
                                    <>
                                        <span>{totalAdjusted.total}</span>
                                        <span>{totalAdjusted.assetCode}</span>
                                    </>
                                )}
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        );
    };

    const renderForm = () => {
        const { collateralAsset = {} } = dataCollateral;
        const totalAvailable = formatNumber(collateralAvailable, collateralAsset?.symbol?.assetDigit);

        return (
            <section>
                <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1 text-sm">
                    <section className="text-base font-semibold">Số lượng</section>
                    <section className={classNames('flex flex-row items-center gap-1', { hidden: tab === TAB_SUBTRACT })}>
                        <div className="flex flex-row">
                            <span>Khả dụng:</span>
                            <span className="dark:text-gray-4 text-gray-15 ml-1 font-semibold">{totalAvailable}</span>
                        </div>
                        <AddCircleColorIcon
                            size={16}
                            onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.SPOT, toWallet: WalletType.FUTURES }))}
                            className="cursor-pointer"
                        />
                    </section>
                </section>
                <TradingInputV2
                    id="amount_input"
                    value={amountAsset || ''}
                    allowNegative={false}
                    thousandSeparator={true}
                    containerClassName="mt-4"
                    inputClassName="!text-left !ml-0"
                    onValueChange={({ value }) => handleAmountChange(value)}
                    allowedDecimalSeparators={[',', '.']}
                    decimalScale={dataCollateral?.collateralAsset?.symbol?.assetDigit || 0}
                    clearAble
                    placeHolder="Nhập số lượng tài sản"
                    validator={validator}
                    errorTooltip={false}
                    renderTail={
                        <div className="flex flex-row gap-2 items-center">
                            <AssetLogo size={24} assetId={dataCollateral?.collateralAsset?.symbol?.id} />
                            <span className="text-gray-15 font-semibold dark:text-gray-4">{dataCollateral?.collateralAsset?.symbol?.assetCode}</span>
                        </div>
                    }
                />
            </section>
        );
    };

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
                                        onClick={() => handleTab(item.key)}
                                    >
                                        {item.title?.[language]}
                                    </section>
                                );
                            })}
                        </section>
                        <section className="dark:bg-dark-4 bg-dark-13 pt-6 pb-4 px-4 rounded-md my-6">
                            <section className="flex flex-row justify-between">
                                <section className="dark:text-gray-7 text-gray-1">Tổng dư nợ</section>
                                <section className="text-gray-15 font-semibold dark:text-gray-4">
                                    {state?.infoDet?.total} {state?.infoDet?.assetCode}
                                </section>
                            </section>
                            <div className="h-[1px] dark:bg-divider-dark bg-divider my-3" />
                            <section className="flex flex-row justify-between">
                                <section className="dark:text-gray-7 text-gray-1">Tổng ký quỹ</section>
                                <section className="text-gray-15 font-semibold dark:text-gray-4">
                                    {adjustedCurrent.total} {adjustedCurrent.assetCode}
                                </section>
                            </section>
                        </section>
                        {renderForm()}
                    </section>
                    {tab === TAB_ADD ? renderAddMargin() : renderSubtractMargin()}
                </section>
                <ButtonV2 disabled={!isSubmitted} className="mt-10" onClick={handleSubmit}>
                    {tab === TAB_ADD ? 'Thêm ký quỹ' : 'Bớt ký quỹ'}
                </ButtonV2>
            </ModalV2>

            <ConfirmAdjustMargin
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
            <AlertAdjust />
        </>
    );
};

export default AdjustMargin;
