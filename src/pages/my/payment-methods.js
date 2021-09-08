import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'react-feather';
import fetchAPI from 'src/utils/fetch-api';
import { ApiStatus } from 'src/redux/actions/const';
import { iconColor } from 'src/config/colors';
import Select from 'src/components/common/input/Select';
import { useTranslation } from 'next-i18next';
import MyPage from '../my';

const PaymentMethods = () => {
    const { t } = useTranslation(['error']);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [loadingMyBanks, setLoadingMyBanks] = useState(false);
    const [loadingAddBank, setLoadingAddBanks] = useState(false);
    const [banks, setBanks] = useState([]);
    const [myBanks, setMyBanks] = useState([]);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [selectedBank, setSelectedBank] = useState({});
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const cancelButtonRef = useRef();
    const getMyBanks = async () => {
        setLoadingMyBanks(true);
        const {
            data,
            status,
        } = await fetchAPI({
            url: '/api/v1/deposit/user_bank_accounts',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setMyBanks(data);
            setLoadingMyBanks(false);
        }
    };
    const getBanks = async () => {
        setLoadingBanks(true);
        const {
            data,
            status,
        } = await fetchAPI({
            url: '/api/v1/deposit/available_banks',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setBanks(data);
            setLoadingBanks(false);
        }
    };
    const addBank = async () => {
        setLoadingAddBanks(true);
        const {
            data,
            status,
        } = await fetchAPI({
            url: '/api/v1/deposit/user_bank_accounts',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setMyBanks(data);
            setLoadingAddBanks(false);
        }
    };
    const openModal = () => {
        setOpen(true);
        setAccountNumber('');
        setErrors({});
    };
    const closeModal = () => {
        setOpen(false);
    };
    const confirmModal = async () => {
        setLoadingAddBanks(true);
        setErrors({});
        const {
            data,
            status,
            message,
        } = await fetchAPI({
            url: '/api/v1/deposit/user_bank_accounts',
            options: {
                method: 'POST',
            },
            params: {
                accountNumber,
                bankCode: selectedBank.bank_code,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            await getMyBanks();
            closeModal();
        } else {
            setErrors({
                accountNumber: message,
            });
        }
        setLoadingAddBanks(false);
    };

    useEffect(() => {
        getMyBanks();
        getBanks();
    }, []);
    return (
        <MyPage>
            <div className={`bg-white rounded-lg p-10 flex flex-col items-center justify-center md:px-[180px] ${myBanks.length ? '' : 'md:py-[150px]'}`}>
                <div className={`${myBanks.length ? 'md:mb-10 w-full' : ''}`}>
                    <div className="text-black-500 mb-6">{t('payment-method:bank_list')}</div>
                    {
                        myBanks.map((bank, index) => (
                            <div
                                className={`flex items-center py-4 ${index > 0 ? 'border-t' : ''}`}
                                key={index}
                            >
                                <img
                                    src={bank.bankLogo}
                                    width={48}
                                    height={48}
                                    className="rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <div className="text-sm font-bold">{bank.bankName}</div>
                                    <div className="text-sm text-black-600">{bank.accountNumber}</div>
                                </div>
                                <div>
                                    {/* <button className="btn btn-icon btn-clean !text-black-400"> */}
                                    {/*    <IconTrash /> */}
                                    {/* </button> */}
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className="max-w-[370px] text-center">
                    <div>
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={openModal}
                        >
                            {t('payment-method:payment_method_add')}
                        </button>
                    </div>
                </div>
                <Transition show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRef}
                        static
                        open={open}
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
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
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
                                <div
                                    className="inline-block w-full max-w-400 py-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                                >
                                    <Dialog.Title className="px-5">
                                        <div className="flex justify-between items-center mb-6">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            >{t('payment-method:payment_method_add')}
                                            </div>
                                            <button className="btn btn-icon" type="button" onClick={closeModal}>
                                                <X color={iconColor} size={24} />
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="px-5 mt-4 text-sm">
                                        <div className="form-group">
                                            <label htmlFor="">{t('payment-method:account_number')}</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.accountNumber ? 'is-error' : ''}`}
                                                onChange={(e => setAccountNumber(e.target.value))}
                                            />
                                            { errors.accountNumber && (
                                                <div className="text-xs text-red mt-2">
                                                    {t(errors.accountNumber)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="">{t('payment-method:bank_name')}</label>
                                            <Select
                                                options={banks.map(e => ({ ...e, label: e.bank_name }))}
                                                onChange={setSelectedBank}
                                                loading={loadingBanks}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-full disabled:opacity-50"
                                                onClick={confirmModal}
                                                disabled={loadingAddBank || !accountNumber}
                                            >
                                                {t('payment-method:confirm')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </MyPage>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my', 'error', 'payment-method']),
        },
    };
}

export default PaymentMethods;
