import { useState, useContext, useEffect } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';

// ** components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PERCENT } from 'components/screens/Lending/constants';

// ** components screens
import SucessAdjust from './SucessAdjust.js';

// ** Context
import { globalActionTypes as actions } from 'components/screens/Lending/context/actions/index.js';

//** Redux
import { API_PUT_HISTORY_LOAN_MARGIN } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';
import { formatLTV } from 'components/screens/Lending/utils';

// ** Context
import { LendingContext } from 'components/screens/Lending/context/index.js';

// ** svg
import { IconClose } from 'components/svg/SvgIcon';

//** components
import ModalV2 from 'components/common/V2/ModalV2';

// ** Third party
import Countdown from 'react-countdown';

const MILLISECOND_COUNT_DOWN = 6000;
const ConfirmAdjustMargin = ({ onCloseAdjustMargin, isConfirmAdjust, tab, currentLTV, adjustedLTV, totalAdjusted, initialLTV, id, amount, onRefreshPrice }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(null);

    useEffect(() => {
        if (isConfirmAdjust && tab !== 'add') {
            setDate(Date.now() + MILLISECOND_COUNT_DOWN);
        }
    }, [isConfirmAdjust]);

    // ** useReducer
    const { state, dispatchReducer } = useContext(LendingContext);

    // ** handle
    const handleToggleModal = () => {
        dispatchReducer({ type: actions.RESET });
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
            } else {
                dispatchReducer({
                    type: actions.TOGGLE_MODAL_ERROR,
                    modal: { isError: true, isConfirmAdjust: false },
                    error: { code: 'ORDER_IS_ACCRUING_INTEREST' }
                });
            }
        } catch (error) {
            throw new Error('error api put Modify margin');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetClick = (props) => {
        onRefreshPrice();
        setDate(Date.now() + MILLISECOND_COUNT_DOWN);
        props?.api?.start();
    };

    const renderCountDown = ({ seconds, completed, ...props }) => {
        return !completed ? (
            <ButtonV2 className="mt-10" onClick={handleSubmitConfirm} disabled={isLoading}>
                Xác nhận({seconds})
            </ButtonV2>
        ) : (
            <ButtonV2 onClick={() => handleResetClick(props)} className="mt-10">
                Làm mới
            </ButtonV2>
        );
    };

    return (
        <>
            <Countdown date={date} renderer={renderCountDown} />
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
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{formatLTV(adjustedLTV)}%</div>
                    </section>
                    <section className="flex flex-row justify-between">
                        <div className="dark:text-gray-7 text-gray-1">Tổng ký quỹ đã điều chỉnh</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{`${totalAdjusted?.total} ${totalAdjusted?.assetCode}`}</div>
                    </section>
                </section>
                {tab === 'add' ? (
                    <ButtonV2 className="mt-10" onClick={handleSubmitConfirm} disabled={isLoading}>
                        Xác nhận
                    </ButtonV2>
                ) : (
                    <Countdown date={date} renderer={renderCountDown} key={date} />
                )}
            </ModalV2>
            <SucessAdjust isModal={state.modal?.isSuccess} onClose={handleToggleModal} tab={tab} adjustedLTV={adjustedLTV} totalAdjusted={totalAdjusted} />
        </>
    );
};
export default ConfirmAdjustMargin;
