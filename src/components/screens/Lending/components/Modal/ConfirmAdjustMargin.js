import { useState } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Redux
import { formatNumber } from 'redux/actions/utils';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** components
import ModalV2 from 'components/common/V2/ModalV2';

// ** Third party
import colors from 'styles/colors';

// ** Dynamic
const SucessLoan = dynamic(() => import('./SucessLoan'), { ssrc: false });

const ConfirmAdjustMargin = ({ isModal, onClose, tab, currentLTV, adjustedLTV, totalAdjusted }) => {
    console.log('totalAdjusted', totalAdjusted());
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isModalConfirm, setIsModalConfirm] = useState(false);

    // ** handle
    const handleToggleModal = () => setIsModalConfirm((prev) => !prev);

    const handleSubmitConfirm = () => {};

    return (
        <>
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
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{tab === 'add' ? 'Xác nhận thêm ký quỹ' : 'Xác nhận Bớt ký quỹ'}</div>
                <section className="mt-6 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">LTV Hiện tại</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{currentLTV}%</div>
                    </section>
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{adjustedLTV.toFixed(0)}%</div>
                    </section>
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">Tổng ký quỹ đã điều chỉnh</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{`${totalAdjusted().total} ${totalAdjusted().assetCode}`}</div>
                    </section>
                </section>
                <ButtonV2 className="mt-10" onClick={handleSubmitConfirm}>
                    Xác nhận
                </ButtonV2>
            </ModalV2>
            <SucessLoan isModal={isModalConfirm} onClose={handleToggleModal} />
        </>
    );
};
export default ConfirmAdjustMargin;
