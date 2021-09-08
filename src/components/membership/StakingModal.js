import { Dialog, Transition } from '@headlessui/react';
import { IconLoading } from 'components/common/Icons';
import find from 'lodash/find';
import { useTranslation } from 'next-i18next';
import { Fragment, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch } from 'react-redux';
import { stakeATS, unstakeATS } from 'redux/actions/membership';
import { formatBalance } from 'redux/actions/utils';
import * as Error from 'src/redux/actions/apiError';
import showNotification from 'utils/notificationService';

const StakingModal = ({ type, handleCloseModal, availableBalance = 0, handleReload }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(true);
    const [autoStake, setAutoStake] = useState(false);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAutoStakeBalance = () => {
        setAutoStake(!autoStake);
    };

    function closeModal() {
        setIsOpen(false);
        setTimeout(handleCloseModal, 200);
    }

    const renderErrorNotification = (errorData) => {
        const { code, data } = errorData;
        const error = find(Error, { code });
        const description = error
            ? t(`error:${error.message}`, { amount: data?.minAmount })
            : t('error:COMMON_ERROR');
        return showNotification({ message: `(${code}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const delay = timeOut => new Promise(resolve => setTimeout(resolve, timeOut));

    const handleStakeAts = async () => {
        if (stakeAmount < 1000) {
            return setError(t('membership:min_stake'));
        }
        setLoading(true);
        const result = await dispatch(await stakeATS({ amount: stakeAmount, autoStake }));
        await delay(11000).then(() => {
            setLoading(false);
            if (result) {
                return renderErrorNotification(result);
            }
            showNotification({ message: t('membership:stake_success'), title: t('common:success'), type: 'success' });
            handleReload();
        });
        return closeModal();
    };

    const handleUnStakeAts = async () => {
        if (stakeAmount <= 0) {
            return setError(t('membership:no_zero'));
        }
        setLoading(true);
        const result = await dispatch(await unstakeATS({ amount: stakeAmount }));
        await delay(11000).then(() => {
            setLoading(false);
            if (result) {
                return renderErrorNotification(result);
            }
            showNotification({ message: t('membership:unstake_success'), title: t('common:success'), type: 'success' });
            handleReload();
        });
        return closeModal();
    };

    if (type === 'STAKE') {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-[400px] p-6 pb-10 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-[12px]">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-bold"
                                >
                                    Staking ATS
                                </Dialog.Title>
                                <div className="mt-6">
                                    <p className="text-sm mb-2">
                                        {t('common:quantity')}
                                    </p>
                                    <div className="relative flex items-center">
                                        <NumberFormat
                                            className="w-full py-3 pl-4 pr-16 border border-[#E1E2ED] rounded-md text-tiny focus:outline-none"
                                            placeholder="Nhập số tiền"
                                            decimalScale={10}
                                            thousandSeparator
                                            allowNegative={false}
                                            value={stakeAmount}
                                            onValueChange={({ value }) => setStakeAmount(Number(value))}
                                            inputMode="decimal"
                                            pattern="[0-9]*"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 text-xs font-bold text-[#4021D0]"
                                            onClick={() => setStakeAmount(availableBalance)}
                                            disabled={loading}
                                        >
                                            {t('common:max')}
                                        </button>
                                    </div>
                                    <p className="text-xs text-red mt-1">
                                        {error}
                                    </p>
                                    <p className="text-xs text-[#52535C] mb-8 mt-4">
                                        {t('membership:available_balance')}: <span className="font-bold">{formatBalance(availableBalance, 6)} ATS</span>
                                    </p>
                                </div>

                                {/* <div className="flex flex-row items-center mt-8">
                                    <input
                                        type="checkbox"
                                        name="autoStake"
                                        id="autoStake"
                                        className="cursor-pointer w-4 h-4"
                                        onChange={handleAutoStakeBalance}
                                        checked={autoStake}
                                    />
                                    <label
                                        htmlFor="autoStake"
                                        className="text-sm ml-2 font-normal cursor-pointer"
                                    >
                                        {t('membership:auto_stake')}
                                    </label>
                                </div> */}

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className={`inline-flex w-full justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none ${loading ? 'cursor-not-allowed bg-[#876dff]' : 'bg-[#4021D0]'}`}
                                        onClick={handleStakeAts}
                                        disabled={loading}
                                    >
                                        { loading && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('common:confirm')}</span>
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    if (type === 'UNSTAKE') {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-[400px] p-6 pb-10 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-[12px]">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-bold"
                                >
                                    {t('membership:unstake')}
                                </Dialog.Title>
                                <div className="mt-6">
                                    <p className="text-sm mb-2">
                                        {t('common:quantity')}
                                    </p>
                                    <div className="relative flex items-center">
                                        <NumberFormat
                                            className="w-full py-3 pl-4 pr-16 border border-[#E1E2ED] rounded-md text-tiny focus:outline-none"
                                            placeholder="Nhập số tiền"
                                            decimalScale={10}
                                            thousandSeparator
                                            allowNegative={false}
                                            value={stakeAmount}
                                            onValueChange={({ value }) => setStakeAmount(Number(value))}
                                            inputMode="decimal"
                                            pattern="[0-9]*"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 text-xs font-bold text-[#4021D0]"
                                            onClick={() => setStakeAmount(availableBalance)}
                                            disabled={loading}
                                        >
                                            {t('common:max')}
                                        </button>
                                    </div>
                                    <p className="text-xs text-red mt-1">
                                        {error}
                                    </p>
                                    <p className="text-xs text-[#52535C] mb-8 mt-4">
                                        {t('membership:available_unstake_balance')}: <span className="font-bold">{formatBalance(availableBalance, 6)} ATS</span>
                                    </p>
                                </div>

                                <div className="text-[#4021D0] text-sm">
                                    <p>
                                        {t('membership:unstake_note_1')}
                                    </p>
                                    {/* <p>
                                        {t('membership:unstake_note_2')}
                                    </p> */}
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className={`inline-flex w-full justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none ${loading ? 'cursor-not-allowed bg-[#876dff]' : 'bg-[#4021D0]'}`}
                                        onClick={handleUnStakeAts}
                                        disabled={loading}
                                    >
                                        { loading && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('common:confirm')}</span>
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    return null;
};

export default StakingModal;
