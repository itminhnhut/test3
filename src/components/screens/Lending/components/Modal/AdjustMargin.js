import { useState, useReducer, useEffect, useMemo, useCallback, useContext } from 'react';

// ** next
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

// ** Redux
import { WalletType } from 'redux/actions/const';
import { setTransferModal } from 'redux/actions/utils';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

// ** Utils
import { totalAsset } from 'components/screens/Lending/utils';

// ** Context
import { usePairPrice, LendingContext } from 'components/screens/Lending/Context';
import { globalActionTypes as actions } from 'components/screens/Lending/Context/actions';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import AssetLogo from 'components/wallet/AssetLogo';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TradingInputV2 from 'components/trade/TradingInputV2';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';

// ** Third party
import classNames from 'classnames';
import useMemoizeArgs from 'hooks/useMemoizeArgs';
import { PERCENT } from '../../constants';
import useDebounce from 'hooks/useDebounce';
import { formatNumber } from 'utils/reference-utils';

const MARGIN = [
    { title: { vi: 'Thêm ký quỹ', en: 'Thêm ký quỹ' }, key: 'add' },
    { title: { vi: 'Bớt ký quỹ', en: 'Bớt ký quỹ' }, key: 'subtract' }
];

const ConfirmAdjustMargin = dynamic(() => import('./ConfirmAdjustMargin'), { ssr: false });

const DEFAULT_VALUE = '-';

const getSpotAvailable = createSelector([(state) => state.wallet?.SPOT, (utils, params) => params], (wallet, params) => {
    const _avlb = wallet?.[params.assetId];
    return _avlb ? Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0) : 0;
});

const DEBOUNCE_TIME = 300;

const AdjustMargin = ({ isModal, onClose, dataCollateral }) => {
    // ** useReducer
    const { state, dispatchReducer } = useContext(LendingContext);

    const dispatch = useDispatch();

    const { getPairPrice, pairPrice } = usePairPrice();

    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** collateral wallet balance
    const collateralAvailable = useSelector((state) => getSpotAvailable(state, { assetId: dataCollateral?.collateralAsset?.symbol?.id }));

    //**  useState
    const [tab, setTab] = useState('add');
    const [error, setError] = useState('');

    const amount = useMemo(() => {
        return state?.amount;
    }, [state?.amount]);

    const debounceAmount = useDebounce(amount, DEBOUNCE_TIME);

    const { collateralCoin, loanCoin, totalDebt, totalCollateralAmount } = dataCollateral || {};
    const total_current_LTV = totalDebt / (totalCollateralAmount * pairPrice?.lastPrice);

    const rsTotalDebt = totalAsset(totalDebt, loanCoin);
    const rsTotalCollateralAmount = totalAsset(totalCollateralAmount, collateralCoin);

    // ** useEffect
    useEffect(() => {
        if (dataCollateral) {
            dispatchReducer({ type: actions.UPDATE, data: { dataCollateral, rsTotalDebt, rsTotalCollateralAmount } });
            // ** reset amount
            dispatchReducer({ type: actions.RESET_AMOUNT });
        }
    }, [useMemoizeArgs(dataCollateral), tab]);

    // ** getPairPrice
    useEffect(() => {
        if (dataCollateral) {
            getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin });
        }
    }, [useMemoizeArgs(dataCollateral)]);

    // ** useEffect
    useEffect(() => {
        if (collateralAvailable < amount) {
            setError('amount > collateralAvailable');
        } else {
            error?.length > 0 && setError('');
        }
    }, [collateralAvailable, amount]);

    useEffect(() => {
        dispatchReducer({ type: actions.UPDATE_TOTAL_ADJUSTED, amount: amount || 0, method: tab });
    }, [debounceAmount]);

    const current_LTV = useMemo(() => {
        return (total_current_LTV * PERCENT).toFixed(0);
    }, [useMemoizeArgs(dataCollateral), pairPrice?.lastPrice]);

    // ** useMemo
    const infoAdjustMargin = useMemo(() => {
        const { infoDet, infoCollateralAmount, initialLTV, totalAdjusted, adjusted_LTV } = state;
        return { infoDet, infoCollateralAmount, totalAdjusted, initialLTV, adjusted_LTV };
    }, [useMemoizeArgs(state)]);

    const adjustedLTV = useMemo(() => {
        return (state.totalDebt / (state.totalAdjusted * pairPrice?.lastPrice || 0)) * PERCENT;
    }, [amount, state.totalDebt, state.totalAdjusted, pairPrice?.lastPrice]);

    // ** handle
    const handleTab = (tab) => {
        setTab(tab);
    };

    const handleCloseModal = () => {
        onClose();
        setTab('add');
    };

    const handleSubmit = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CONFIRM_ADJUST }); //** open modal confirm */
        getPairPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin }); //** update market price */
    };

    const handleAmountChange = (value) => {
        if (+value < 0 || +value > collateralAvailable) {
            setError('2132312');
            dispatchReducer({ type: actions.UPDATE_AMOUNT, amount: value });
            return;
        }
        if (!value) {
            dispatchReducer({ type: actions.RESET_AMOUNT });
        } else {
            dispatchReducer({ type: actions.UPDATE_AMOUNT, amount: value });
        }
    };

    const validationAdd = () => {
        return amount > 0 && amount <= collateralAvailable;
    };

    const validationSubtract = () => {
        const Initial_LTV = state.initialLTV * PERCENT;
        return current_LTV < Initial_LTV && adjustedLTV <= Initial_LTV && validationAdd();
    };

    const isSubmitted = useMemo(() => {
        return tab === 'add' ? validationAdd() : validationSubtract();
    }, [tab, amount]);

    const handleCloseConfirmAdjustMargin = () => {
        setTimeout(() => {
            dispatchReducer({ type: actions.TOGGLE_MODAL_CONFIRM_ADJUST });
        }, 100);
    };

    const validator = useMemo(() => {
        let err = error;

        // for (const key of Object.keys(state.errors)) {
        //     if (state?.errors?.[key]) {
        //         error = state.errors[key];
        //         break;
        //     }
        // }
        return { isValid: !Boolean(err), msg: err, isError: Boolean(err) };
    }, [error]);

    console.log('state', state);
    // ** render
    const renderAddMargin = () => {
        return (
            <>
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                <section className="flex flex-col gap-3 mt-6">
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV Hiện tại</div>
                        <div className="dark:text-gray-4 font-semibold">{current_LTV}%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">{amount > 0 ? `${adjustedLTV?.toFixed(0)}%` : DEFAULT_VALUE} </div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7 flex-wrap">
                        <div>Tổng ký quỹ điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold flex flex-row gap-1">
                            {amount > 0 ? (
                                <>
                                    <span>{totalAdjusted.total}</span>
                                    <span>{totalAdjusted.assetCode}</span>
                                </>
                            ) : (
                                DEFAULT_VALUE
                            )}
                        </div>
                    </section>
                </section>
            </>
        );
    };

    const totalAdjusted = useMemo(() => {
        const total = formatNumber(infoAdjustMargin?.totalAdjusted, infoAdjustMargin?.infoCollateralAmount?.assetDigit);
        const assetCode = infoAdjustMargin?.infoCollateralAmount?.assetCode;
        return { total, assetCode };
    }, [infoAdjustMargin?.totalAdjusted, infoAdjustMargin?.infoCollateralAmount?.assetDigit]);

    const renderSubtractMargin = () => {
        return (
            <>
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Lưu ý</div>
                <div className="my-6 text-gray-1 dark:text-gray-7">{`Chỉ cho phép bớt ký quỹ khi LTV < LTV ban đầu. LTV cuối cùng phải ≤ LTV ban đầu.`}</div>
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                <section className="flex flex-col gap-3 mt-6">
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV ban đầu</div>
                        <div className="dark:text-gray-4 font-semibold">{infoAdjustMargin?.initialLTV * PERCENT}%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV Hiện tại</div>
                        <div className="dark:text-gray-4 font-semibold">{current_LTV}%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">{amount > 0 ? `${adjustedLTV?.toFixed(0)}%` : DEFAULT_VALUE} </div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7 flex-wrap">
                        <div>Tổng ký quỹ điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold flex flex-row gap-1">
                            {amount > 0 ? (
                                <>
                                    <span>{totalAdjusted.total}</span>
                                    <span>{totalAdjusted.assetCode}</span>
                                </>
                            ) : (
                                DEFAULT_VALUE
                            )}
                        </div>
                    </section>
                </section>
            </>
        );
    };

    const renderForm = () => {
        const { collateralAsset = {} } = dataCollateral;
        const totalAvailable = formatNumber(collateralAvailable, collateralAsset?.symbol?.assetDigit);

        return (
            <section>
                <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1 text-sm">
                    <section className="">Số lượng</section>
                    <section className="flex flex-row items-center gap-1">
                        <div className="flex flex-row">
                            <span>Khả dụng:</span>
                            <span className="dark:text-gray-4 text-gray-15">
                                {totalAvailable} {collateralAsset?.symbol?.assetCode}
                            </span>
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
                    value={amount || ''}
                    allowNegative={false}
                    thousandSeparator={true}
                    containerClassName="mt-4"
                    inputClassName="!text-left !ml-0"
                    onValueChange={({ value }) => handleAmountChange(value)}
                    // decimalScale={state.stakingCurrency.value === 72 ? 0 : 4}
                    allowedDecimalSeparators={[',', '.']}
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
                isVisible={state.modal?.isAdjust}
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
                                        className={classNames('w-1/2 dark:text-gray-7 text-gray-1 font-semibold py-4', {
                                            'dark:bg-dark-2 bg-dark-12 dark:text-gray-4 text-gray-15': item.key === tab,
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
                                    {infoAdjustMargin?.infoDet?.total} {infoAdjustMargin?.infoDet?.assetCode}
                                </section>
                            </section>
                            <div className="h-[1px] dark:bg-divider-dark bg-divider my-3" />
                            <section className="flex flex-row justify-between">
                                <section className="dark:text-gray-7 text-gray-1">Tổng ký quỹ</section>
                                <section className="text-gray-15 font-semibold dark:text-gray-4">
                                    {infoAdjustMargin?.infoCollateralAmount?.total} {infoAdjustMargin?.infoCollateralAmount?.assetCode}
                                </section>
                            </section>
                        </section>
                        {renderForm()}
                    </section>
                    <section className="w-1/2 dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">{tab === 'add' ? renderAddMargin() : renderSubtractMargin()}</section>
                </section>
                <ButtonV2 disabled={!isSubmitted} className="mt-10" onClick={handleSubmit}>
                    {tab === 'add' ? 'Thêm ký quỹ' : 'Bớt ký quỹ'}
                </ButtonV2>
            </ModalV2>
            <ConfirmAdjustMargin
                tab={tab}
                amount={amount}
                id={dataCollateral?._id}
                currentLTV={current_LTV}
                adjustedLTV={adjustedLTV}
                totalAdjusted={totalAdjusted}
                dispatchReducer={dispatchReducer}
                initialLTV={infoAdjustMargin?.initialLTV}
                isConfirmAdjust={state.modal?.isConfirmAdjust}
                onCloseAdjustMargin={handleCloseConfirmAdjustMargin}
            />
        </>
    );
};

export default AdjustMargin;
