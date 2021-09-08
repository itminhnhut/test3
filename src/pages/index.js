/* eslint-disable react/jsx-closing-tag-location */
import { Dialog, Transition } from '@headlessui/react';
import { DOWNLOAD_APP_LINK, LoginButtonPosition } from 'actions/const';
import { getLoginUrl } from 'actions/utils';
import Footer from 'components/common/Footer';
import { IconServicesColored, IconStepArrow, IconUIColored, IconWalletColored } from 'components/common/Icons';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { ChevronRight, XCircle } from 'react-feather';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import AirdropVIDBModal from 'src/components/common/AirdropVIDBModal';
import { iconColor, iconColorViolet } from 'src/config/colors';
import { getPromo1VIDBStatus } from 'src/redux/actions/promotion';

const HomeSymbolList = dynamic(
    () => import('components/markets/HomeSymbolList'),
    { ssr: false },
);

const Index = () => {
    const { t } = useTranslation(['common', 'landing', 'home']);
    const router = useRouter();
    const { locale } = useRouter();
    const [activePromotionModal, setActivePromotionModal] = useState(false);
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const features = [
        {
            title: t('landing:section_1_feature_1_title'),
            description: t('landing:section_1_feature_1_desc'),
            buttonName: t('landing:section_1_feature_1_cta'),
            route: `/spot/BTC_${quoteAsset}`,
            icon: <IconWalletColored />,
        },
        {
            title: t('landing:section_1_feature_2_title'),
            description: t('landing:section_1_feature_2_desc'),
            buttonName: t('landing:section_1_feature_2_cta'),
            route: '',
            icon: <IconUIColored />,
        },
        {
            title: t('landing:section_1_feature_3_title'),
            description: t('landing:section_1_feature_3_desc'),
            buttonName: t('landing:section_1_feature_3_cta'),
            route: '/markets',
            icon: <IconServicesColored />,
        },
    ];

    const cancelButtonRegisterRef = useRef();
    const [openRegister, setOpenRegister] = useState(false);
    const closeModalRegister = () => {
        setOpenRegister(false);
    };
    const openModalRegister = () => {
        setOpenRegister(true);
    };

    useAsync(async () => {
        const promotion = await getPromo1VIDBStatus();
        if (promotion?.promoStatus === 'ongoing' && promotion?.userStatus === 'not_received') setActivePromotionModal(true);
    }, []);

    const handleClickRegister = () => {
        if (isMobile) {
            openModalRegister();
        } else {
            router.push(getLoginUrl('sso', 'register', { utm_content: LoginButtonPosition.WEB_BANNER_HOME }), undefined, { shallow: false });
        }
    };

    const handleClosePromotion = () => {
        setActivePromotionModal(false);
    };

    const _renderSymbolList = useMemo(() => {
        return (
            <HomeSymbolList />
        );
    }, []);

    return (
        <LayoutWithHeader showBanner>
            {activePromotionModal && <AirdropVIDBModal handleClose={handleClosePromotion} />}
            <div className="bg-black-5 lg:pt-[4.5rem] pt-10">
                <div className="ats-container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-center lg:-mt-14 mt-10">
                        <div className="lg:order-1 order-2">
                            <div className="text-6xl font-semibold mb-6 lg:max-w-[448px] letter-spacing-02">
                                Nami <br />
                                Exchange
                            </div>
                            <div className="text-xl text-black-600 mb-10">
                                {t('landing:welcome_text_1')} <br
                                    className="xl:inline xl:visible hidden invisible"
                                />{t('landing:welcome_text_2')}
                            </div>
                            <button
                                className="btn btn-primary btn-lg"
                                type="button"
                                onClick={handleClickRegister}
                            >
                                {t('landing:register_cta')}
                            </button>

                        </div>
                        <div className="lg:order-2 order-1 col-span-2">
                            <Image
                                src="/public/images/bg/home-section1.svg"
                                alt=""
                                priority
                                width={840}
                                height={663}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-section2 lg:py-[7.5rem] py-10 border-0 border-b border-black-300">
                <div className="ats-container">
                    <div className="card card-shadow border border-black-200 bg-white rounded-xl mb-[3.75rem]">
                        {_renderSymbolList}
                    </div>
                    <div className="flex items-center justify-center">
                        <Link href="/markets" locale={locale}>
                            <button className="btn btn-primary btn-clean flex items-center " type="button">
                                <span className="mr-3">{t('landing:go_to_market_cta')}</span> <ChevronRight
                                    color={iconColorViolet}
                                    size={16}
                                />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="bg-white lg:py-[7.5rem] py-10">
                <div className="ats-container">
                    <div className="text-4xl font-semibold mb-4 text-center">
                        {t('landing:section_1_title')}
                    </div>
                    <div className="text-black-500 text-lg font-medium mb-16 text-center">
                        {t('landing:section_1_desc')}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-[75px]">
                        {features.map((feature, index) => (
                            <div className="text-center" key={index}>
                                <div className="w-[8.75rem] h-[8.75rem] mx-auto flex items-center justify-center mb-10">
                                    {feature.icon}
                                </div>
                                <div className="text-lg font-semibold letter-spacing-02 mb-6">
                                    {feature.title}
                                </div>
                                <div className="text-black-500 font-medium mb-4">
                                    {feature.description}
                                </div>
                                {
                                    feature.route ? (
                                        <Link href={feature.route} locale={locale}>
                                            <button
                                                className="btn btn-primary btn-clean flex items-center mx-auto"
                                                type="button"
                                            >
                                                <span className="mr-3">
                                                    {feature.buttonName}
                                                </span><ChevronRight
                                                    color={iconColorViolet}
                                                    size={16}
                                                />
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-clean flex items-center mx-auto"
                                            type="button"
                                            onClick={openModalRegister}
                                        >
                                            <span className="mr-3">
                                                {feature.buttonName}
                                            </span><ChevronRight
                                                color={iconColorViolet}
                                                size={16}
                                            />
                                        </button>
                                    )
                                }

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center lg:py-[7.5rem] py-10 bg-home-section4 2xl:min-h-[640px]">
                <div className="ats-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div>
                            <div className="text-5xl font-semibold mb-12 text-white">
                                {t('landing:section_hero')}
                            </div>
                            <button
                                className="btn btn-lg btn-primary-reserve"
                                type="button"
                                onClick={handleClickRegister}
                            >
                                {t('landing:section_hero_cta')}
                            </button>
                        </div>
                        <div />
                    </div>
                </div>
            </div>
            <div className="bg-white lg:py-[7.5rem] py-10">
                <div className="ats-container">
                    <div className="flex flex-col lg:flex-row items-center justify-between mb-[4.375rem]">
                        <div className="flex-1 lg:mb-0 mb-10">
                            <Image
                                src="/public/images/bg/home-section5.svg"
                                alt=""
                                priority
                                width={620}
                                height={562}
                            />
                        </div>
                        <div className="flex-1 ml-auto lg:max-w-[510px]">
                            <div className="text-5xl font-semibold mb-8"><span
                                className="text-violet-700"
                            >Nami
                            </span> {t('landing:section_2_feature_1_title')}
                            </div>
                            <div className="text-lg text-black-600 mb-10">
                                {t('landing:section_2_feature_1_desc')}
                            </div>
                            <Link href="/markets" locale={locale} prefetch={false}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    type="button"
                                >{t('landing:section_2_feature_1_cta')}</button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between mb-[4.375rem]">
                        <div className="flex-1 lg:max-w-[510px] order-2 lg:order-1">
                            <div className="text-5xl font-semibold mb-8"><span
                                className="text-violet-700"
                            >Nami
                            </span> {t('landing:section_2_feature_2_title')}
                            </div>
                            <div className="text-lg text-black-600 mb-10">{t('landing:section_2_feature_2_desc')}
                            </div>
                            <Link href="/markets" locale={locale} prefetch={false}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    type="button"
                                >{t('landing:section_2_feature_2_cta')}</button>
                            </Link>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 lg:mb-0 mb-10">
                            <div className="flex justify-end">
                                <Image
                                    src="/public/images/bg/home-section6.svg"
                                    alt=""
                                    priority
                                    width={620}
                                    height={562}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="flex-1 lg:mb-0 mb-10">
                            <Image
                                src="/public/images/bg/home-section7.svg"
                                alt=""
                                priority
                                width={620}
                                height={692}
                            />
                        </div>
                        <div className="flex-1 ml-auto lg:max-w-[510px]">
                            <div className="text-5xl font-semibold mb-8"><span
                                className="text-violet-700"
                            >Nami
                            </span> {t('landing:section_2_feature_3_title')}
                            </div>
                            <div className="text-lg text-black-600 mb-10">{t('landing:section_2_feature_3_desc')}
                            </div>
                            <Link href="/markets" locale={locale} prefetch={false}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    type="button"
                                >{t('landing:section_2_feature_3_cta')}</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black-700 lg:py-[7.5rem] py-10 text-white">
                <div className="ats-container">
                    <div className="text-4xl font-semibold mb-4 text-center">{t('landing:section_3_title')}</div>
                    <div className="text-black-500 text-lg font-medium mb-20 text-center">{t('landing:section_3_desc')}
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between mb-20">
                        <div className="text-center">
                            <div className="steps-number">01</div>
                            <div className="text-2xl font-semibold letter-spacing-02">
                                {t('landing:section_3_step_1')}
                            </div>
                        </div>
                        <div>
                            <div className="hidden lg:block">
                                <IconStepArrow />
                            </div>
                            <div className="block lg:hidden my-5">
                                <IconStepArrow down />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="steps-number">02</div>
                            <div className="text-2xl font-semibold letter-spacing-02">
                                {t('landing:section_3_step_2')}
                            </div>
                        </div>
                        <div>
                            <div className="hidden lg:block">
                                <IconStepArrow />
                            </div>
                            <div className="block lg:hidden my-5">
                                <IconStepArrow down />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="steps-number">03</div>
                            <div className="text-2xl font-semibold letter-spacing-02">
                                {t('landing:section_3_step_3')}
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <a
                            className="btn btn-green btn-lg"
                            href={getLoginUrl('sso', 'register', { utm_content: LoginButtonPosition.WEB_BANNER_HOME })}
                            target="blank"
                        >
                            {t('landing:section_3_cta')}
                        </a>
                    </div>
                </div>
            </div>
            <Footer />

            <Transition show={openRegister} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    initialFocus={cancelButtonRegisterRef}
                    static
                    open={openRegister}
                    onClose={closeModalRegister}
                >
                    <div className="md:min-h-screen min-h-[calc(100%-10rem)] px-4 text-center">
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
                                className="inline-block w-full max-w-400 mb-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl "
                            >
                                <Dialog.Title className="">
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="text-xl font-medium leading-8 text-black-800"
                                        />
                                        <button
                                            className="btn btn-icon"
                                            type="button"
                                            onClick={closeModalRegister}
                                        >
                                            <XCircle color={iconColor} size={24} />
                                        </button>
                                    </div>
                                </Dialog.Title>
                                <div className="text-sm rounded-2xl bg-white">
                                    <div className="bg-black-5 rounded-t-2xl py-4">
                                        <img
                                            src="/public/images/bg/dialog-register-header.svg"
                                            alt=""
                                            className="mx-auto"
                                        />
                                    </div>
                                    <div className="px-6 py-8 text-center !font-bold">
                                        <div className="text-xl">{t('landing:download_app_hint')}</div>
                                        <div className="text-xl text-violet mb-[30px]">Nami Exchange</div>
                                        <div className="">
                                            <a
                                                href={DOWNLOAD_APP_LINK.IOS}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <button
                                                    className="btn btn-black w-full mb-2"
                                                    type="button"
                                                    rel="noreferrer"
                                                >
                                                    {t('landing:download_app_hint_appstore')}
                                                </button>
                                            </a>
                                            <a
                                                href={DOWNLOAD_APP_LINK.ANDROID}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <button
                                                    className="btn btn-primary w-full"
                                                    type="button"
                                                >
                                                    {t('landing:download_app_hint_googleplay')}
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'footer', 'navbar', 'landing', 'home', 'promotion']),
    },
});
export default Index;
