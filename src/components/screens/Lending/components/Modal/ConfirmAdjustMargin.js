import { useState, useContext } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Context
import { globalActionTypes as actions } from 'components/screens/Lending/Context/actions';

//** Redux
import { API_PUT_HISTORY_LOAN_MARGIN } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Context
import { LendingContext } from 'components/screens/Lending/Context';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import { PERCENT } from '../../constants';

// ** Dynamic
const SucessLoan = dynamic(() => import('./SucessLoan'), { ssrc: false });

const ConfirmAdjustMargin = ({ onCloseAdjustMargin, isConfirmAdjust, tab, currentLTV, adjustedLTV, totalAdjusted, initialLTV, id, amount }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isLoading, setIsLoading] = useState(false);

    // ** useReducer
    const { state, dispatchReducer } = useContext(LendingContext);

    // ** handle
    const handleToggleModal = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_RESET });
        dispatchReducer({ type: actions.RESET_AMOUNT });
        dispatchReducer({ type: actions.REFETCH });
    };

    const handleSubmitConfirm = async () => {
        try {
            setIsLoading(true);
            const { statusCode } = await FetchApi({
                url: API_PUT_HISTORY_LOAN_MARGIN.replace(':id', id),
                params: {
                    amount: tab === 'add' ? +amount : -amount
                },
                options: {
                    method: 'PUT'
                }
            });
            if (statusCode === 200) {
                dispatchReducer({ type: actions.TOGGLE_MODAL_SUCCESS_ADJUST });
            }
        } catch (error) {
            throw new Error('error api put Modify margin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ModalV2
                isVisible={isConfirmAdjust}
                className="w-[488px] overflow-auto no-scrollbar"
                onBackdropCb={onCloseAdjustMargin}
                wrapClassName="p-6 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={onCloseAdjustMargin}
                        >
                            <IconClose />
                        </div>
                    </div>
                )}
            >
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{tab === 'add' ? 'Xác nhận thêm ký quỹ' : 'Xác nhận bớt ký quỹ'}</div>
                <section className="mt-6 dark:bg-dark-4 bg-gray-13 rounded-xl p-4 flex flex-col gap-4">
                    {tab !== 'add' ? (
                        <section className="flex flex-row justify-between">
                            <div className="dark:text-gray-7 text-gray-1">LTV ban đầu</div>
                            <div className="dark:text-gray-4 text-gray-15 font-semibold">{initialLTV * PERCENT}%</div>
                        </section>
                    ) : null}
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
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{`${totalAdjusted?.total} ${totalAdjusted?.assetCode}`}</div>
                    </section>
                </section>
                <ButtonV2 className="mt-10" onClick={handleSubmitConfirm} disabled={isLoading}>
                    Xác nhận
                </ButtonV2>
            </ModalV2>
            <SucessLoan isModal={state.modal?.isSuccess} onClose={handleToggleModal} tab={tab} adjustedLTV={adjustedLTV} totalAdjusted={totalAdjusted} />
        </>
    );
};
export default ConfirmAdjustMargin;
