import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useState } from 'react';
import { claimPromo1VIDBStatus } from 'redux/actions/promotion';

const AirdropVIDBModal = ({ handleClose }) => {
    const { t } = useTranslation(['common', 'promotion']);

    const [isOpen, setIsOpen] = useState(true);

    async function closeModal() {
        await claimPromo1VIDBStatus();
        setIsOpen(false);
    }

    useEffect(() => {
        if (!isOpen) setTimeout(handleClose(), 200);
        return clearTimeout(handleClose(), 200);
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as="div" className="fixed w-full h-full z-30 flex items-center justify-center top-0 left-0 bg-[rgba(0,0,0,0.6)]">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto w-full h-full flex items-center justify-center"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center flex items-center justify-center">
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
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="flex flex-col items-center justify-center w-full max-w-[400px] p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-[12px]">
                            <img src="/images/vidb.png" alt="airdrop-vidb" className="w-[186px] h-[180px]" />
                            <div className="mt-12">
                                <p className="text-lg font-bold">
                                    {t('promotion:congrat_first')} <span className="text-[#05b169]">1 VIDB</span> {t('promotion:congrat_last')}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="mt-8 text-white bg-[#4021D0] w-full px-8 py-[11px] rounded-md"
                                onClick={closeModal}
                            >
                                {t('promotion:take_reward')}
                            </button>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AirdropVIDBModal;
