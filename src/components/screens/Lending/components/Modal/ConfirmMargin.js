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

const DATA = [{ vi: 'LTV Hiện tại', en: 'LTV Hiện tại' }, { vi: 'LTV đã điều chỉnh' }, { vi: 'Tổng ký quỹ đã điều chỉnh', en: 'Tổng ký quỹ đã điều chỉnh' }];

const ConfirmMargin = ({ isModal, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isModalConfirm, setIsModalConfirm] = useState(false);

    // ** handle
    const handleToggleModal = () => setIsModalConfirm((prev) => !prev);

    // ** handle
    const total = ['85%', '55%', '2 BTC'];

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
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Xác nhận thêm ký quỹ</div>
                <section className="mt-6 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {DATA?.map((item, key) => {
                        return (
                            <section className="flex flex-row justify-between" key={`modal_confirm_loan_${key}_${total?.[key]}`}>
                                <div className="dark:text-gray-7 text-gray-1">{item?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{total?.[key]}</div>
                            </section>
                        );
                    })}
                </section>
                <ButtonV2 className="mt-10">Xác nhận</ButtonV2>
            </ModalV2>
            <SucessLoan isModal={isModalConfirm} onClose={handleToggleModal} />
        </>
    );
};
export default ConfirmMargin;
