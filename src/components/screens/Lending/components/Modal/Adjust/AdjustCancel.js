import { useContext } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';

// ** Context
import { LendingContext } from 'components/screens/Lending/Context';
import { globalActionTypes as actions } from 'components/screens/Lending/Context/actions';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

// ** svg
import { IconClose, BxsErrorIcon } from 'components/svg/SvgIcon';

const AdjustCancel = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { state, dispatchReducer } = useContext(LendingContext);

    const handleCancel = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_RESET });
        dispatchReducer({ type: actions.RESET_AMOUNT });
    };

    const onClose = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CANCEL, isCancel: false, isAdjust: true });
    };

    return (
        <ModalV2
            isVisible={state.modal?.isCancel}
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
            <section className="flex flex-col items-center text-center">
                <BxsErrorIcon size={80} />
                <div className="dark:text-gray-4 text-gray-15 mt-6 mb-4 font-semibold text-2xl">Huỷ bỏ điều chỉnh</div>
                <div className="dark:text-gray-7 text-gray-1">Khi bạn xác nhận huỷ, tất cả thông tin điều chỉnh ký quỹ sẽ được huỷ bỏ.</div>
            </section>
            <ButtonV2 className="mt-10 dark:bg-green-2 bg-green-3 font-semibold" onClick={handleCancel}>
                Huỷ
            </ButtonV2>
        </ModalV2>
    );
};
export default AdjustCancel;
