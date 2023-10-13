// ** Next
import { useTranslation } from 'next-i18next';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';
import { CheckCircleIcon } from 'components/svg/SvgIcon';

// ** Third party
import colors from 'styles/colors';
import { useRouter } from 'next/router';

const DATA2 = { vi: 'Tài sản ký quỹ', en: 'Tài sản ký quỹ' };

const SucessLoan = ({ isModal, onClose, collateralCoin, collateralAmount, loanAmount, loanCoin }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const router = useRouter();

    return (
        <ModalV2
            isVisible={isModal}
            className="w-[545px] overflow-auto no-scrollbar"
            onBackdropCb={onClose}
            wrapClassName="p-6 flex flex-col text-txtPrimary dark:text-txtPrimary-dark tracking-normal"
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
            <section className="flex flex-col items-center">
                <CheckCircleIcon size={80} color={colors.teal} />
                <div className="mt-6 mb-4 text-txtSecondary dark:text-txtSecondary-dark">{t('lending:lending.modal.success_loan.title')}</div>
                <div className="mb-6 text-2xl font-semibold">
                    {loanAmount} {loanCoin}
                </div>
                <section className="dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex w-full">
                    <section className="flex justify-between w-full">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('lending:lending.modal.collateral_amount')}</div>
                        <div className="font-semibold">
                            {collateralAmount} {collateralCoin}
                        </div>
                    </section>
                </section>
            </section>
            <ButtonV2
                onClick={() =>
                    onClose().then(() => {
                        router.replace(
                            {
                                pathname: router.pathname,
                                query: {
                                    tab: 'loan'
                                }
                            },
                            undefined,
                            {
                                shallow: true
                            }
                        );
                    })
                }
                className="mt-10"
            >
                {t('lending:lending.modal.success_loan.view_loans')}
            </ButtonV2>
        </ModalV2>
    );
};
export default SucessLoan;
