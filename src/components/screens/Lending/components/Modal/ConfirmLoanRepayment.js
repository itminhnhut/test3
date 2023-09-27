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

const DATA = [
    { vi: 'Tổng dư nợ', en: 'Tổng dư nợ' },
    { vi: 'Dư nợ còn lại', en: 'Dư nợ còn lại' },
    { vi: 'Tỉ giá', en: 'Tỉ giá' },
    { vi: 'Tài sản ký quỹ đã dùng', en: 'Tài sản ký quỹ đã dùng' },
    { vi: 'Ký quỹ hoàn trả ước tính', en: 'Ký quỹ hoàn trả ước tính' }
];

const DATA2 = [
    { vi: 'LTV ban đầu', en: 'LTV ban đầu' },
    { vi: 'LTV ước tính', en: '55%' }
];

const ConfirmLoanRepayment = ({ isModal, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isModalConfirm, setIsModalConfirm] = useState(false);

    // ** handle
    const handleToggleModal = () => setIsModalConfirm((prev) => !prev);

    // ** handle
    const total = ['70,000,000 VNDC', '35,000,000 VNDC', '1 BTC ≈ 615,000,000.23 VND', '0,46 BTC', '0,87 BTC'];
    const total2 = ['75%', '55%'];

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
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Xác nhận trả khoản vay</div>
                <div className="mt-6 dark:text-gray-4 text-gray-15 font-semibold">Thông tin dư nợ và ký quỹ</div>
                <section className="mt-4 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {DATA?.map((item, key) => {
                        return (
                            <section className="flex flex-row justify-between" key={`modal_confirm_loan_${key}_${total?.[key]}`}>
                                <div className="dark:text-gray-7 text-gray-1">{item?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{total?.[key]}</div>
                            </section>
                        );
                    })}
                </section>
                <div className="mt-6 dark:text-gray-4 text-gray-15 font-semibold">Thông tin LTV</div>
                <section className="mt-4 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {DATA2?.map((item, key) => {
                        return (
                            <section className="flex flex-row justify-between" key={`modal_confirm_loan_${key}_${total2?.[key]}`}>
                                <div className="dark:text-gray-7 text-gray-1">{item?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{total2?.[key]}</div>
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
export default ConfirmLoanRepayment;
