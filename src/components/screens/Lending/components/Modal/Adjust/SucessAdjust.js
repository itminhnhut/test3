import { useCallback, useState } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

// ** Redux
import { formatNumber } from 'redux/actions/utils';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';
import { CheckCircleIconV2 } from 'components/svg/SvgIcon';

// ** Third party
import colors from 'styles/colors';
import { useRouter } from 'next/router';

const SucessLoan = ({ isModal, onClose, tab, adjustedLTV, totalAdjusted }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const router = useRouter();

    return (
        <ModalV2
            isVisible={isModal}
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
            <section className="flex flex-col items-center">
                <CheckCircleIconV2 size={80} color={colors.teal} />
                <div className="dark:text-gray-7text-gray-15 mt-6 mb-4">{tab === 'add' ? 'Thêm ký quỹ thành công' : 'Bớt ký quỹ thành công'}</div>
                <div className="dark:text-txtPrimary-dark text-txtPrimary font-semibold text-2xl">
                    {totalAdjusted?.total} {totalAdjusted?.assetCode}
                </div>
                <section className="dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex w-full mt-6">
                    <section className="flex justify-between w-full">
                        <div className="dark:text-gray-7 text-gray-1">LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{(adjustedLTV || 0)?.toFixed(0)}%</div>
                    </section>
                </section>
            </section>
            <ButtonV2
                onClick={() => {
                    router.replace(
                        {
                            pathname: router.pathname,
                            query: {
                                tab: 'history',
                                action: 'adjust'
                            }
                        },
                        undefined,
                        {
                            shallow: false
                        }
                    );
                    onClose();
                }}
                className="mt-10 dark:bg-green-2 bg-green-3 font-semibold"
            >
                Xem lịch sử điều chỉnh ký quỹ
            </ButtonV2>
        </ModalV2>
    );
};
export default SucessLoan;
