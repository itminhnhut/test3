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
import { CheckCircleIcon } from 'components/svg/SvgIcon';

// ** Third party
import colors from 'styles/colors';
import { useRouter } from 'next/router';

const DATA2 = { vi: 'Tài sản ký quỹ', en: 'Tài sản ký quỹ' };

const SucessLoan = ({ isModal, onClose, collateralCoin, collateralAmount }) => {
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
                <CheckCircleIcon size={80} color={colors.teal} />
                <div className="dark:text-gray-4 text-gray-15 mt-6 mb-4">Vay thành công</div>
                <section className="dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex w-full">
                    <section className="flex justify-between w-full">
                        <div className="dark:text-gray-7 text-gray-1">{DATA2?.[language]}</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">
                            {collateralAmount || 0.368} {collateralCoin || 'BTC'}
                        </div>
                    </section>
                </section>
            </section>
            <ButtonV2
                onClick={() => {
                    router.replace(
                        {
                            pathname: router.pathname,
                            query: {
                                tab: 'loan'
                            }
                        },
                        undefined,
                        {
                            shallow: false
                        }
                    );
                    onClose();
                }}
                className="mt-10"
            >
                Xem khoản vay đang mở
            </ButtonV2>
        </ModalV2>
    );
};
export default SucessLoan;
