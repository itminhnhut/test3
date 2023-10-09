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

// ** Dynamic
const SucessLoan = dynamic(() => import('./SucessLoan'), { ssrc: false });

const CONFIRM_INFORMATION = [
    { vi: 'Tài sản vay', en: 'Tài sản vay', key: 'loanValue' },
    { vi: 'Tài sản ký quỹ', en: 'Tài sản ký quỹ', key: 'collateralValue' },
    { vi: 'Lãi ước tính theo kỳ hạn', en: 'Lãi ước tính theo kỳ hạn', key: 'termInterestAmount' },
    { vi: 'Lãi hằng ngày', en: 'Lãi hằng ngày', key: 'dailyInterestPercent' },
    { vi: 'Thời hạn vay', en: 'Thời hạn vay', key: 'loanTerm' },
    { vi: 'Thời gian hết hạn', en: 'Thời gian hết hạn', key: 'endLoanTermDate' }
];

const DATA2 = { vi: 'Tổng dư nợ', en: 'Tổng dư nợ' };

const LoanTermExpireDate = memo(({ daysOfTerm, format = 'hh:mm:ss dd/MM/yyy' }) => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);

        return () => clearInterval(interval);
    }, []);

    return formatTime(addDays(now, daysOfTerm), format);
});

const ConfirmLoan = memo(({ isOpen, onClose, loanInfor, registerLoan, onSuccessClose, handleRefetchPrice, loadingCollateralPrice }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isShowModalConfirm, setModalConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerLoanResponse, setRegisterLoanResponse] = useState(null);

    // ** handle
    const handleToggleModalConfirm = () => setModalConfirm((prev) => !prev);

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
        loanTerm: `${loanInfor?.['loanTerm']} ngày`,
        endLoanTermDate: <LoanTermExpireDate daysOfTerm={loanInfor?.['loanTerm']} />
    };

    const handlerRegisterLoan = async () => {
        setLoading(true);
        try {
            const registerResponse = await registerLoan();
            if (registerResponse?.data && registerResponse?.message === ApiStatus.SUCCESS) {
                setRegisterLoanResponse(registerResponse.data);
                onClose();
                setTimeout(() => handleToggleModalConfirm(), 200);
            }
        } catch (error) {
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
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Xác nhận khoản vay</div>
                <section className="my-6 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {CONFIRM_INFORMATION?.map((item, key) => {
                        return (
                            <section className="flex flex-row justify-between" key={`modal_confirm_loan_${key}_${item.key}`}>
                                <div className="dark:text-gray-7 text-gray-1">{item?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{confirmInfor?.[item.key]}</div>
                            </section>
                        );
                    })}
                </section>
                <section className="dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">{DATA2?.[language]}</div>
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
            <SucessLoan
                isModal={isShowModalConfirm}
                collateralAmount={formatNumber(registerLoanResponse?.collateralAmount, collateralDigit)}
                collateralCoin={registerLoanResponse?.collateralCoin}
                onClose={() => {
                    handleToggleModalConfirm();
                    setTimeout(() => onSuccessClose(), 150);
                }}
            />
        </>
    );
});
export default ConfirmLoan;
