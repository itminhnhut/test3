import { memo, useCallback, useEffect, useState } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Redux
import { formatNumber, formatTime } from 'redux/actions/utils';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import dynamic from 'next/dynamic';

// ** Third party
import addDays from 'date-fns/addDays';
import { ApiStatus } from 'redux/actions/const';
import RegisterLoanButton from './RegisterLoanButton';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

// ** Dynamic
const SucessLoan = dynamic(() => import('./SucessLoan'), { ssrc: false });

const CONFIRM_INFORMATION = [
    { key: 'loanValue', localized: 'loan_amount' },
    { key: 'collateralValue', localized: 'collateral_amount' },
    { key: 'termInterestAmount', localized: 'confirm_loan.interest_est' },
    { key: 'dailyInterestPercent', localized: 'confirm_loan.daily_interest_rate' },
    { key: 'loanTerm', localized: 'confirm_loan.loan_term' },
    { key: 'endLoanTermDate', localized: 'confirm_loan.expire_date' }
];

const ConfirmLoan = memo(({ isOpen, onClose, loanInfor, registerLoan, onSuccessClose, handleRefetchPrice, loadingCollateralPrice }) => {
    const { t } = useTranslation();

    // ** useState
    const [modal, setModal] = useState({
        isShowConfirm: false,
        isShowError: false
    });

    const [loading, setLoading] = useState(false);
    const [registerLoanResponse, setRegisterLoanResponse] = useState(null);

    // ** handle
    const handleToggleModalConfirm = () => setModal((prevState) => ({ ...prevState, isShowConfirm: !prevState.isShowConfirm }));
    const handleToggleModalError = () => setModal((prevState) => ({ ...prevState, isShowError: !prevState.isShowError }));

    // ** variable
    const loanCoin = loanInfor.loanable?.assetCode;
    const collateralCoin = loanInfor.collateral?.assetCode;

    const loanValue = loanInfor?.['loanValue'];
    const collateralValue = loanInfor?.['collateralValue'];

    const loanDigit = loanInfor?.loanable?.assetDigit || 0;
    const collateralDigit = loanInfor?.collateral?.assetDigit || 0;

    const termInterestAmount = loanInfor?.['loanInterest']?.['termInterestAmount'];
    const totalDebt = +loanValue + +termInterestAmount;

    //** mapping data
    const confirmInfor = {
        loanValue: `${formatNumber(loanValue, loanDigit)} ${loanCoin}`,
        collateralValue: `${formatNumber(collateralValue, collateralDigit)} ${collateralCoin}`,
        termInterestAmount: `${formatNumber(termInterestAmount, loanDigit)} ${loanCoin}`,
        dailyInterestPercent: `${loanInfor?.['loanInterest']?.['dailyInterestPercent']?.toFixed(4)} %`,
        loanTerm: `${loanInfor?.['loanTerm']} ${t('common:days')}`,
        endLoanTermDate: formatTime(addDays(new Date(), loanInfor?.['loanTerm']), 'hh:mm:ss dd/MM/yyyy')
    };

    const handlerRegisterLoan = async () => {
        setLoading(true);
        try {
            const registerResponse = await registerLoan();
            onClose();
            if (registerResponse?.data && registerResponse?.message === ApiStatus.SUCCESS) {
                setRegisterLoanResponse(registerResponse.data);
                setTimeout(() => handleToggleModalConfirm(), 200);
            } else {
                setTimeout(() => handleToggleModalError(), 200);
            }
        } catch (error) {
            handleToggleModalError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ModalV2
                isVisible={isOpen}
                className="w-[488px] overflow-auto no-scrollbar"
                onBackdropCb={onClose}
                wrapClassName="p-6 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
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
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{t('lending:lending.modal.confirm_loan.title')} </div>
                <section className="my-6 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {CONFIRM_INFORMATION?.map((item, key) => {
                        return (
                            <section className="flex flex-row justify-between" key={`modal_confirm_loan_${key}_${item.key}`}>
                                <div className="dark:text-gray-7 text-gray-1">{t(`lending:lending.modal.${item?.localized}`)}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{confirmInfor?.[item.key]}</div>
                            </section>
                        );
                    })}
                </section>
                <section className="dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">{t('lending:lending.modal.confirm_loan.debt_est')}</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">
                            {formatNumber(totalDebt, loanDigit)} {loanCoin}
                        </div>
                    </section>
                </section>
                <RegisterLoanButton
                    handlerRegisterLoan={handlerRegisterLoan}
                    loading={loading}
                    handleRefetch={handleRefetchPrice}
                    loadingPrice={loadingCollateralPrice}
                />
            </ModalV2>

            <AlertModalV2 isVisible={modal.isShowError} onClose={handleToggleModalError} type="error" title="Lỗi" message="Có lỗi xảy ra" />

            <SucessLoan
                isModal={modal.isShowConfirm}
                collateralAmount={formatNumber(registerLoanResponse?.collateralAmount, collateralDigit)}
                collateralCoin={registerLoanResponse?.collateralCoin}
                loanAmount={formatNumber(registerLoanResponse?.loanAmount, loanDigit)}
                loanCoin={registerLoanResponse?.loanCoin}
                onClose={() => {
                    handleToggleModalConfirm();
                    // this must return a promise to detect setTimeout has done
                    return new Promise((resolve) => setTimeout(() => resolve(onSuccessClose()), 150));
                }}
            />
        </>
    );
});
export default ConfirmLoan;
