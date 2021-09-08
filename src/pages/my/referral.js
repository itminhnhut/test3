import { Trans, useTranslation } from 'next-i18next';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getLoginUrl } from 'actions/utils';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { truncate } from 'src/utils/helpers';
import {
    EmailShareButton,
    FacebookMessengerShareButton,
    FacebookShareButton,
    TelegramShareButton,
    TwitterShareButton,
} from 'react-share';

const Referral = () => {
    const { t } = useTranslation(['common', 'referral']);
    const [open, setOpen] = useState(false);
    const [openQr, setOpenQr] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const user = useSelector(state => state.auth.user) || null;
    const shareButtonRef = useRef();
    const qrButtonRef = useRef();
    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };
    const closeModalQr = () => {
        setOpenQr(false);
    };
    const openModalQr = () => {
        setOpen(false);
        setOpenQr(true);
    };

    const referralLink = () => {
        if (user) {
            return `${process.env.APP_URL}/register?ref=${user?.id}`;
        }
        return '';
    };

    return (
        <LayoutWithHeader>
            <div className="flex flex-1 justify-center bg-black-50">
                <div className="referral-container px-10 xl:px-0 xl:max-w-screen-xl w-full rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        <div className="card card-shadow bg-white order-2 lg:order-1">
                            <div className="card-body referral-invitation letter-spacing-02">
                                <div className="text-5xl font-semibold mb-3">{t('referral:title')}</div>
                                <div className="text-lg text-black-500 mb-8">
                                    <Trans i18nKey="referral:subtitle" t={t}>
                                        Nhận <span className="text-violet-700 font-semibold">20.000 VNDC</span> cho mỗi người bạn bè đăng kí
                                    </Trans>
                                </div>
                                <div className="form-group !mb-8">
                                    <label>
                                        {t('referral:referral_link_label')}
                                    </label>
                                    <div className="input-group !border-black-300">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg font-semibold"
                                            value={truncate(referralLink(), 40)}
                                            readOnly
                                        />
                                        <div className="input-group-append items-center">
                                            <CopyToClipboard
                                                text={referralLink()}
                                                className="cursor-pointer text-sm text-violet-700 font-semibold"
                                                onCopy={() => setCopied(true)}
                                            >
                                                <span>{copied ? t('referral:copied') : t('referral:copy')}</span>
                                            </CopyToClipboard>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group !mb-8">
                                    <label>
                                        {t('referral:enter_code')}
                                    </label>
                                    <div className="input-group !border-black-300">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg font-semibold"
                                            value={user?.id}
                                            readOnly
                                        />
                                        <div className="input-group-append items-center">
                                            <CopyToClipboard
                                                text={user?.id}
                                                className="cursor-pointer text-sm text-violet-700 font-semibold"
                                                onCopy={() => setCopiedCode(true)}
                                            >
                                                <span>{copiedCode ? t('referral:copied') : t('referral:copy')}</span>
                                            </CopyToClipboard>

                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1">
                                    {
                                        user ? (
                                            <button className="btn btn-primary" type="button" onClick={openModal}>
                                                {t('referral:invite_now')}
                                            </button>
                                        ) : (
                                            <a
                                                href={getLoginUrl('sso')}
                                                className="btn btn-primary text-center"
                                            >
                                                {t('sign_in_to_continue')}
                                            </a>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center text-center order-1 lg:order-2">
                            <img src="/images/bg/referral-section1.svg" alt="Gift" />
                        </div>
                    </div>
                </div>
                <Transition show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={shareButtonRef}
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
                                    className="inline-block w-full max-w-[480px] my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl py-10 px-6 "
                                >
                                    <div className="mb-6 text-black-600 text-sm font-medium">
                                        {t('referral:share_link')}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        <FacebookShareButton url={referralLink()}>
                                            <button
                                                className="btn-referral"
                                                type="button"
                                                ref={shareButtonRef}
                                            >
                                                <img
                                                    src="/images/icons/icon-facebook.png"
                                                    alt=""
                                                    className=""
                                                />
                                            </button>
                                        </FacebookShareButton>
                                        <TwitterShareButton url={referralLink()}>
                                            <button
                                                className="btn-referral"
                                                type="button"
                                            >
                                                <img
                                                    src="/images/icons/icon-twitter.png"
                                                    alt=""
                                                    className=""
                                                />
                                            </button>
                                        </TwitterShareButton>
                                        <TelegramShareButton url={referralLink()}>
                                            <button
                                                className="btn-referral"
                                                type="button"
                                            >
                                                <img
                                                    src="/images/icons/icon-telegram.png"
                                                    alt=""
                                                    className=""
                                                />
                                            </button>
                                        </TelegramShareButton>
                                        <FacebookMessengerShareButton url={referralLink()}>
                                            <button
                                                className="btn-referral"
                                                type="button"
                                            >
                                                <img
                                                    src="/images/icons/icon-messenger.png"
                                                    alt=""
                                                    className=""
                                                />
                                            </button>
                                        </FacebookMessengerShareButton>
                                        <EmailShareButton url={referralLink()}>
                                            <button
                                                className="btn-referral"
                                                type="button"
                                            >
                                                <img
                                                    src="/images/icons/icon-imessage.png"
                                                    alt=""
                                                    className=""
                                                />
                                            </button>
                                        </EmailShareButton>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
                <Transition show={openQr} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={qrButtonRef}
                        static
                        open={openQr}
                        onClose={closeModalQr}
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
                                    className="inline-block w-full max-w-400 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                                >
                                    <div className="qr-invitation grid grid-cols-1">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="flex items-center justify-center"
                                                type="button"
                                                ref={qrButtonRef}
                                            >
                                                <div>
                                                    <img
                                                        src="/images/qr.svg"
                                                        alt=""
                                                        className="mb-8 mx-auto w-[220px]"
                                                    />
                                                    <div className="text-black-700 font-medium">{t('referral:qr_code')}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </div>

        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'referral', 'navbar']),
    },
});
export default Referral;
