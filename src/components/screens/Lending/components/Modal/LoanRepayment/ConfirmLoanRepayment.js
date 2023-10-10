import { useContext, useState } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

// ** Redux
import { ApiStatus } from 'redux/actions/const';
import { formatNumber } from 'redux/actions/utils';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** CONTEXT
import { LendingContext } from 'components/screens/Lending/Context';
import { globalActionTypes as lendingContextActions } from 'components/screens/Lending/Context/actions';
import ConfirmLoanButton from './ConfirmLoanButton';
import { REPAY_TAB } from '.';

// ** Dynamic
const AlertModalV2 = dynamic(() => import('components/common/V2/ModalV2/AlertModalV2'), { ssrc: false });
const LoanToValueInfor = dynamic(() => import('./LoanToValueInfor'), { ssrc: false });
const DebtInfor = dynamic(() => import('./DebtInfor'), { ssrc: false });

const ConfirmLoanRepayment = ({ repaymentData, isModal, onClose, onCloseMainModal, repayLoan, handleRefetchPrice, loadingPrice }) => {
    const {
        initialLTV,
        adjustLTV,
        isLoanRepay,
        repayAmount,
        repayInLoanAmount,
        totalDebt,
        totalDebtLeft,
        loanCoinConfig,
        collateralCoinConfig,
        collateralPriceToLoanCoin,
        collateralAmountReceive,
        repayType
    } = repaymentData;

    const { dispatchReducer } = useContext(LendingContext);

    const { t, i18n } = useTranslation();

    const router = useRouter();

    // ** useState
    const [isShowSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [repayData, setRepayData] = useState(null);

    // ** handle
    const handleToggleModal = () => setShowSuccessModal((prev) => !prev);

    const onRepayHandler = async () => {
        setLoading(true);
        try {
            const repayResponse = await repayLoan();
            if (repayResponse?.message === ApiStatus.SUCCESS || repayResponse?.data) {
                // close het 2 modal
                onClose();
                onCloseMainModal();

                // open success modal after 250ms
                setTimeout(() => handleToggleModal(), 250);

                setRepayData(repayResponse?.data);

                // refetch lai lich su khoan vay
                dispatchReducer({ type: lendingContextActions.REFETCH });
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const onHandleConfirmSuccess = () =>
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    tab: 'history',
                    action: 'repay'
                }
            },
            undefined
        );

    return (
        <>
            <ModalV2
                isVisible={isModal}
                className="w-[488px] overflow-auto no-scrollbar"
                onBackdropCb={onClose}
                wrapClassName="p-6 flex flex-col tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={onClose}
                        >
                            <IconClose />
                        </div>
                    </div>
                )}
            >
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Xác nhận trả khoản vay</div>
                <div className="mt-6 dark:text-gray-4 text-gray-15 font-semibold">Thông tin dư nợ và ký quỹ</div>
                <section className="mt-4 dark:bg-dark-4 bg-gray-13 rounded-xl p-4">
                    <DebtInfor
                        {...{
                            isLoanRepay,
                            repayAmount,
                            totalDebt,
                            totalDebtLeft,
                            loanCoinConfig,
                            collateralCoinConfig,
                            collateralPriceToLoanCoin,
                            collateralAmountReceive
                        }}
                    />
                </section>

                <div className="mt-6 dark:text-gray-4 text-gray-15 font-semibold">Thông tin LTV</div>
                <section className="mt-4 dark:bg-dark-4 bg-gray-13 rounded-xl p-4">
                    <LoanToValueInfor {...{ initialLTV, adjustLTV }} />
                </section>

                {repayType === REPAY_TAB.LOAN ? (
                    <ButtonV2 loading={loading} onClick={onRepayHandler} className="mt-10">
                        Xác nhận
                    </ButtonV2>
                ) : (
                    <ConfirmLoanButton loading={loading} handleRefetch={handleRefetchPrice} loadingPrice={loadingPrice} onRepayHandler={onRepayHandler} />
                )}
            </ModalV2>

            {/* SUCCESS MODAL */}
            <AlertModalV2
                onConfirm={onHandleConfirmSuccess}
                textButton="Xem lịch sử thanh toán"
                message="Trả khoản vay thành công"
                isVisible={isShowSuccessModal}
                onClose={handleToggleModal}
                type="success"
            >
                <div className="mt-4 w-full">
                    <div className="text-2xl text-center font-semibold mb-6">
                        {formatNumber(repayInLoanAmount, loanCoinConfig?.assetDigit || 0)} {loanCoinConfig?.assetCode}
                    </div>
                    <div className="dark:bg-dark-4 bg-gray-13 p-4 rounded-xl flex justify-between items-center">
                        <div>Dư nợ còn lại</div>
                        <div className=" font-semibold">
                            {formatNumber(repayData?.totalDebt, loanCoinConfig?.assetDigit || 0)} {loanCoinConfig?.assetCode}
                        </div>
                    </div>
                </div>
            </AlertModalV2>
        </>
    );
};
export default ConfirmLoanRepayment;
