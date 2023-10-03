import { useState } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Redux
import { ApiStatus } from 'redux/actions/const';
import { formatNumber } from 'redux/actions/utils';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** components
import ModalV2 from 'components/common/V2/ModalV2';

// ** Dynamic
const AlertModalV2 = dynamic(() => import('components/common/V2/ModalV2/AlertModalV2'), { ssrc: false });
const LoanToValueInfor = dynamic(() => import('./LoanToValueInfor'), { ssrc: false });
const DebtInfor = dynamic(() => import('./DebtInfor'), { ssrc: false });

const ConfirmLoanRepayment = ({ repaymentData, isModal, onClose, onCloseMainModal, repayLoan }) => {
    const {
        initialLTV,
        adjustLTV,
        isLoanRepay,
        repayAmount,
        totalDebt,
        totalDebtLeft,
        loanCoinConfig,
        collateralCoinConfig,
        collateralPriceToLoanCoin,
        collateralAmountReceive
    } = repaymentData;

    const {
        t,
        i18n: { language }
    } = useTranslation();

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
                onClose();
                onCloseMainModal();
                setTimeout(() => handleToggleModal(), 250);
                setRepayData(repayResponse?.data);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

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
                <ButtonV2 loading={loading} onClick={onRepayHandler} className="mt-10">
                    Xác nhận
                </ButtonV2>
            </ModalV2>
            <AlertModalV2
                onConfirm={() => {
                    router.replace(
                        {
                            pathname: router.pathname,
                            query: {
                                tab: 'history',
                                action: ''
                            }
                        },
                        undefined
                    );
                }}
                textButton="Xem lịch sử thanh toán"
                message="Trả khoản vay thành công"
                isVisible={isShowSuccessModal}
                onClose={handleToggleModal}
                type="success"
            >
                <div className="mt-4 w-full">
                    <div className="text-2xl text-center font-semibold mb-6">
                        {formatNumber(repayAmount, loanCoinConfig?.assetDigit || 0)} {loanCoinConfig?.assetCode}
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
