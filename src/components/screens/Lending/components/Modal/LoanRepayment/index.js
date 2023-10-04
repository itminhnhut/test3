import { useCallback, useMemo, useState } from 'react';

// ** next
import { useTranslation } from 'next-i18next';

// ** Redux
import { ceilByExactDegit, formatNumber2, roundByExactDigit, setTransferModal } from 'redux/actions/utils';
import { useSelector, useDispatch } from 'react-redux';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import InputSlider from 'components/trade/InputSlider';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import TradingInputV2 from 'components/trade/TradingInputV2';

import AssetLogo from 'components/wallet/AssetLogo';
import { getSpotAvailable } from 'components/screens/Lending/utils/selector';
import { getAssetConfig } from 'components/screens/Lending/Context';
import { WalletType } from 'redux/actions/const';
import RepaymentInformation from './RepaymentInformation';
import useRepayLoan from 'components/screens/Lending/hooks/useRepayLoan';
import { getCurrentLTV, getReceiveCollateral } from 'components/screens/Lending/utils';
import { PERCENT } from 'components/screens/Lending/constants';
import PercentageInput from './PercentageInput';
import ModalCancelLoanRepayment from './CancelLoanRepayment';

export const REPAY_TAB = {
    LOAN: 'loan',
    COLLATERAL: 'collateral'
};

const INPUT_FIELD = {
    AMOUNT: 'amount',
    PERCENTAGE: 'percentage'
};

const ModalConfirmLoanRepayment = dynamic(() => import('./ConfirmLoanRepayment'), { ssr: false });

const INIT_STATE = {
    input: {
        percentage: 0,
        amount: ''
    },
    typingField: INPUT_FIELD.PERCENTAGE,
    tab: REPAY_TAB.LOAN,
    isShowConfirm: false,
    isShowConfirmCancel: false
};

const LoanRepayment = ({ dataCollateral, isOpen, onClose: onCloseRepaymentModal }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const dispatch = useDispatch();
    const assetConfig = useSelector((state) => state.utils.assetConfig) || [];
    const assetByCode = useMemo(() => {
        return assetConfig?.length && assetConfig.reduce((prevObj, asset) => ({ ...prevObj, [asset?.assetCode]: asset }), {});
    }, [assetConfig]);

    const { totalDebt, initialLTV, totalCollateralAmount, collateralCoin, loanCoin, price: collateralPriceToLoanCoin, _id: loanId } = dataCollateral;

    //**  useState
    const [state, set] = useState(INIT_STATE);
    const setState = (newState) => set((prev) => ({ ...prev, ...newState }));

    const isLoanRepay = state.tab === REPAY_TAB.LOAN;
    const isTypingAmountField = state.typingField === INPUT_FIELD.AMOUNT;

    const loanCoinConfig = assetByCode?.[loanCoin];
    const collateralCoinConfig = assetByCode?.[collateralCoin];
    // ** loan asset balance
    const loanCoinAvailable = useSelector((state) => getSpotAvailable(state, { assetId: loanCoinConfig?.id }));

    const repayInLoanAmount = +state.input.amount;

    // amount repay in loanCoin and collateralCoin
    const repayAmount = {
        [REPAY_TAB.LOAN]: repayInLoanAmount,
        [REPAY_TAB.COLLATERAL]: repayInLoanAmount / collateralPriceToLoanCoin
    }?.[state.tab];

    // ki quy da su dung
    const marginUsed = {
        [REPAY_TAB.LOAN]: 0, // tra bang tai san vay luon = 0
        [REPAY_TAB.COLLATERAL]: repayInLoanAmount / collateralPriceToLoanCoin
    }?.[state.tab];

    // so luong ki quy nhan lai uoc tinh
    const collateralAmountReceive = getReceiveCollateral({ repayAmount: repayInLoanAmount, totalDebt, totalCollateralAmount, marginUsed });

    // ki quy con lai
    const totalMarginLeft = totalCollateralAmount - collateralAmountReceive;

    // tong du no con lai
    const totalDebtLeft = totalDebt - repayInLoanAmount;

    // ltv dieu chinh
    const adjustLTV = getCurrentLTV({ totalDebtLeft, totalCollateralLeft: totalMarginLeft, collateralPrice: collateralPriceToLoanCoin });

    //** useCustomHook
    const repayLoan = useRepayLoan({
        type: state.tab,
        amount: repayInLoanAmount,
        loanId
    });

    // repayment information
    const repaymentDataProps = useMemo(
        () => ({
            initialLTV,
            adjustLTV,
            isLoanRepay,
            totalDebtLeft,
            totalDebt,
            loanCoinConfig,
            collateralCoinConfig,
            collateralPriceToLoanCoin,
            repayAmount,
            collateralAmountReceive
        }),
        [
            initialLTV,
            adjustLTV,
            isLoanRepay,
            totalDebtLeft,
            totalDebt,
            loanCoinConfig?.assetCode,
            collateralCoinConfig?.assetCode,
            collateralPriceToLoanCoin,
            repayAmount,
            collateralAmountReceive
        ]
    );

    // ** handle
    const onHandlerInputChange = useCallback(
        (inputField, inputValue) => {
            // field con lai
            const otherField = {
                percentage: 'amount',
                amount: 'percentage'
            }[inputField];

            // gia tri cua field con lai
            const otherValue = {
                percentage: roundByExactDigit((inputValue / totalDebt) * PERCENT, 0), // field "percentage" lam tron xuong
                amount: ceilByExactDegit((totalDebt * inputValue) / PERCENT, 0) // field "amount" lam tron len
            }[otherField];

            if (inputField === 'amount' && +inputValue > totalDebt) {
                return;
            }

            setState({
                input: {
                    [inputField]: inputValue,
                    [otherField]: otherValue
                }
            });
        },
        [totalDebt]
    );

    const handleToggleConfirmModal = () => setState({ isShowConfirm: !state.isShowConfirm });

    const onChangeRepayTypeHandler = (newTab) => {
        setState({ tab: newTab });
    };

    const onHandleAddMoreBalance = () => {
        dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT, asset: loanCoin }));
    };

    const onRepayHandler = async (type) => {
        if (type === 'showConfirm') {
            return handleToggleConfirmModal();
        }
        return await repayLoan();
    };

    const validator = useMemo(() => {
        let isValid = true,
            isError = false,
            msg = '';

        // loan repay phai check balance cua loanCoin
        if (isLoanRepay) {
            if (+repayInLoanAmount > loanCoinAvailable) {
                isValid = false;
                isError = true;
                msg = t('lending:lending.modal.input_description.insufficient_balance');
            }
        }

        return {
            isValid,
            isError,
            msg
        };
    }, [loanCoinAvailable, repayInLoanAmount, isLoanRepay]);

    const onHandleCloseRepaymentModal = (forceClose = false) => {
        if (!forceClose && +repayInLoanAmount > 0) {
            setState({ isShowConfirmCancel: true });
            return;
        }
        setState(INIT_STATE);
        onCloseRepaymentModal();
    };

    const isDisableRepayButton = !repayInLoanAmount || +repayInLoanAmount === 0 || validator.isError;

    return (
        <>
            <ModalV2
                isVisible={isOpen}
                className="w-[800px] overflow-auto no-scrollbar"
                onBackdropCb={onHandleCloseRepaymentModal}
                wrapClassName="p-6 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={(e) => onHandleCloseRepaymentModal()}
                        >
                            <IconClose />
                        </div>
                    </div>
                )}
            >
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Trả khoản vay</div>
                <section className="mt-6 flex flex-row gap-6">
                    <section className="w-1/2">
                        <section className="cursor-pointer flex flex-row border rounded border-divider dark:border-divider-dark justify-between text-center bg-white dark:bg-dark">
                            {Object.keys(REPAY_TAB).map((key, index) => {
                                const repayType = REPAY_TAB[key];
                                return (
                                    <section
                                        key={`repay_${repayType}}`}
                                        className={classNames('w-1/2 dark:text-gray-7 text-gray-1 py-4', {
                                            'dark:bg-dark-2 bg-dark-12  font-semibold !text-txtPrimary dark:!text-txtPrimary-dark': repayType === state.tab,
                                            'border-r-[1px] border-r-divider dark:border-r-divider-dark': index === 0
                                        })}
                                        onClick={() => onChangeRepayTypeHandler(repayType)}
                                    >
                                        {t(`lending:repayment.${repayType}`)}
                                    </section>
                                );
                            })}
                        </section>
                        <section className="mt-6">
                            <section className="flex flex-row justify-between mb-2 text-txtPrimary  dark:text-txtPrimary-dark">
                                <div className="font-semibold">Số lượng</div>
                                {isLoanRepay && (
                                    <section className="flex text-sm flex-row gap-1 items-center">
                                        <div className="space-x-1">
                                            <span className="dark:text-txtSecondary-dark text-txtSecondary">{t('common:available_balance')}</span>
                                            <span className="font-semibold ">{formatNumber2(loanCoinAvailable, loanCoinConfig?.assetDigit || 0) || '0'}</span>
                                        </div>

                                        <div className="inline-block" onClick={onHandleAddMoreBalance}>
                                            <AddCircleColorIcon size={16} className="cursor-pointer" />
                                        </div>
                                    </section>
                                )}
                            </section>
                            <div className="mb-4 ">
                                <TradingInputV2
                                    containerClassName="!bg-gray-12 dark:!bg-dark-2"
                                    clearAble
                                    allowNegative={false}
                                    placeholder={t('lending:lending.modal.collateral_input.placeholder')}
                                    thousandSeparator={true}
                                    inputClassName="!text-left !ml-0 !text-txtPrimary dark:!text-txtPrimary-dark"
                                    errorTooltip={false}
                                    decimalScale={loanCoinConfig?.assetDigit || 0}
                                    value={state.input.amount}
                                    validator={validator}
                                    errorTooltip={false}
                                    onValueChange={({ value }) => {
                                        onHandlerInputChange('amount', value);
                                    }}
                                    renderTail={
                                        <div className={classNames('text-txtPrimary dark:text-txtPrimary-dark flex items-center space-x-2')}>
                                            <div className="w-6 h-6 min-w-[24px] min-h-[24px]">
                                                <AssetLogo useNextImg={true} size={24} assetCode={loanCoinConfig?.assetCode} />
                                            </div>
                                            <div className="font-semibold">{loanCoinConfig?.assetCode || loanCoinConfig?.assetName}</div>
                                        </div>
                                    }
                                    onFocus={() => setState({ typingField: 'amount' })}
                                />
                            </div>
                            <PercentageInput
                                tab={state.tab}
                                onHandlerInputChange={(value) => {
                                    onHandlerInputChange('percentage', value);
                                    setState({ typingField: 'percentage' });
                                }}
                                isTypingAmountField={isTypingAmountField}
                                percentageFormat={state.input.percentage}
                            />
                        </section>
                    </section>
                    <section className="w-1/2 dark:bg-dark-2 bg-gray-12 p-4 text-txtPrimary dark:text-txtPrimary-dark rounded-xl">
                        <RepaymentInformation {...repaymentDataProps} />
                    </section>
                </section>
                <ButtonV2 disabled={isDisableRepayButton} onClick={() => onRepayHandler('showConfirm')} className="mt-10">
                    Trả khoản vay
                </ButtonV2>
            </ModalV2>

            <ModalCancelLoanRepayment
                isOpen={state.isShowConfirmCancel}
                onClose={() => setState({ isShowConfirmCancel: false })}
                onConfirm={() => onHandleCloseRepaymentModal(true)}
            />

            <ModalConfirmLoanRepayment
                repaymentData={repaymentDataProps}
                repayLoan={onRepayHandler}
                isModal={state.isShowConfirm}
                onClose={handleToggleConfirmModal}
                onCloseMainModal={onCloseRepaymentModal}
            />
        </>
    );
};

export default LoanRepayment;
