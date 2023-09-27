import { useCallback, useState } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Redux
import { formatNumber } from 'redux/actions/utils';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import dynamic from 'next/dynamic';

// ** Third party
import colors from 'styles/colors';

// ** Dynamic
const SucessLoan = dynamic(() => import('./SucessLoan'), { ssrc: false });

const DATA = [
    { vi: 'Tài sản vay', en: 'Tài sản vay' },
    { vi: 'Tài sản ký quỹ', en: 'Tài sản ký quỹ' },
    { vi: 'Lãi ước tính theo kỳ hạn', en: 'Lãi ước tính theo kỳ hạn' },
    { vi: 'Lãi hằng ngày', en: 'Lãi hằng ngày' },
    { vi: 'Thời hạn vay', en: 'Thời hạn vay' },
    { vi: 'Thời gian hết hạn', en: 'Thời gian hết hạn' }
];

const DATA2 = { vi: 'Tổng dư nợ', en: 'Tổng dư nợ' };

const ConfirmLoan = ({ isModal, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isModalConfirm, setIsModalConfirm] = useState(false);

    // ** handle
    const handleToggleModal = () => setIsModalConfirm((prev) => !prev);

    // ** handle
    const total = ['100,000,000 VNDC', '3 BTC', '2,369,000 VNDC', '0.1234%', '7 ngày', '09:55:39 19/08/2023'];

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
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Xác nhận khoản vay</div>
                <section className="my-6 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {DATA?.map((item, key) => {
                        return (
                            <section className="flex flex-row justify-between" key={`modal_confirm_loan_${key}_${total?.[key]}`}>
                                <div className="dark:text-gray-7 text-gray-1">{item?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{total?.[key]}</div>
                            </section>
                        );
                    })}
                </section>
                <section className="dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">{DATA2?.[language]}</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">102,369,000 VNDC</div>
                    </section>
                </section>
                <ButtonV2 className="mt-10">Xác nhận</ButtonV2>
            </ModalV2>
            <SucessLoan isModal={isModalConfirm} onClose={handleToggleModal} />
        </>
    );
};
export default ConfirmLoan;
