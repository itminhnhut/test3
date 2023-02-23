import React, { useState } from 'react';
import Link from 'next/link';
import { AppleIcon, GooglePlayIcon } from '../../svg/SvgIcon';
import GradientButton from '../../common/V2/ButtonV2/GradientButton';
import { THEME_MODE } from 'hooks/useDarkMode';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import classNames from 'classnames';
import { getS3Url } from 'redux/actions/utils';

// Import Swiper styles
import 'swiper/css';

const SwitchTheme = ({ themeMode, onChangeTheme }) => {
    const [disableToggle, setDisabledToggle] = useState(false);

    return (
        <div
            className={classNames(
                'relative  w-[114px] h-[54px] rounded-full  cursor-pointer ',
                {
                    'bg-dominant ': themeMode === THEME_MODE.DARK
                },
                {
                    'bg-gray-11 dark:bg-dark-2': themeMode === THEME_MODE.LIGHT
                }
            )}
            onClick={() => {
                if (onChangeTheme && !disableToggle) {
                    onChangeTheme();

                    // avoid instant click
                    setDisabledToggle(true);
                    setTimeout(() => setDisabledToggle(false), 200);
                }
            }}
        >
            <div
                className={classNames(
                    'absolute w-[48px] h-[48px] top-1/2 -translate-y-1/2 rounded-full duration-100  flex items-center justify-center transition-all ease-in',
                    { 'left-1  bg-white text-dominant': themeMode === THEME_MODE.DARK },
                    { 'left-[calc(100%-4px)] -translate-x-full bg-dominant text-gray-11 dark:text-dark-2': themeMode === THEME_MODE.LIGHT }
                )}
            >
                {themeMode !== THEME_MODE.LIGHT ? <SvgMoon size={32} color="currentColor" /> : <SvgSun size={32} color="currentColor" />}
            </div>
        </div>
    );
};

const HomeLightDark = ({ onShowQr, t }) => {
    const [themeMode, setThemeMode] = useState(THEME_MODE.DARK);

    const onChange = () => {
        setThemeMode((prev) => (prev === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK));
    };

    return (
        <div className="dark:bg-dark-dark bg-white m relative py-[120px]">
            <div id="download_section" className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto px-4 relative">
                <div className="flex flex-col items-center justify-center mb-[70px] z-1000">
                    <div className="text-xs tooltip-arrow-bottom mb-[30px] justify-center items-center w-[85px] h-[38px] inline-flex animate-bounce	 rounded-full">
                        Thử ngay{' '}
                    </div>
                    <div className="flex justify-center ">
                        <SwitchTheme onChangeTheme={onChange} themeMode={themeMode} />
                    </div>
                </div>

                <div className="relative bg-transparent">
                    <div
                        className="absolute left-[35%] top-1/2 pointer-events-none -translate-x-1/2 w-full h-full -translate-y-1/2 "
                        // style={{ background: `url('${getS3Url('/images/screen/homepage/splash_dark.png')}') no-repeat center`,backgroundSize:'cover' }}
                    >
                        <Image src={getS3Url('/images/screen/homepage/splash_dark.png')} layout="fill" />
                    </div>
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1.5}
                        centeredSlides
                        loop
                        allowTouchMove
                        breakpoints={{
                            540: {
                                slidesPerView: 2
                            },
                            768: {
                                slidesPerView: 3.5,
                                spaceBetween: 20
                            },

                            1028: {
                                slidesPerView: 5,
                                centeredSlides: false,
                                spaceBetween: 40,
                                loop: false,
                                allowTouchMove: false
                            }
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        onSwiper={(swiper) => undefined}
                        onSlideChange={() => undefined}
                    >
                        {[...Array(5).keys()].map((_, index) => (
                            <SwiperSlide key={index} className="">
                                <div className="relative overflow-hidden w-full h-[650px] md:h-[435px]">
                                    <Image
                                        src={getS3Url(`/images/screen/homepage/iphone_${index + 1}_${themeMode}.png`)}
                                        layout="fill"
                                        className="p-1"
                                        alt="iphone"
                                        objectFit="contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex justify-between  -m-3 flex-col-reverse lg:flex-row lg:items-center pt-[90px]">
                    <div className="flex flex-wrap items-center gap-4 p-3">
                        <Link href="https://apps.apple.com/app/id1480302334" passHref>
                            <GradientButton className="text-left py-2 px-6 w-auto">
                                <a style={{ color: 'inherit' }} className="text-inherit flex items-center justify-center">
                                    <AppleIcon color="currentColor" />

                                    <div className="ml-3">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">App Store</div>
                                    </div>
                                </a>
                            </GradientButton>
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange" passHref>
                            <GradientButton className="text-left py-2 px-6 w-auto">
                                <a style={{ color: 'inherit' }} className="text-inherit flex items-center justify-center">
                                    <GooglePlayIcon />

                                    <div className="ml-3">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">Google Play</div>
                                    </div>
                                </a>
                            </GradientButton>
                        </Link>

                        <div onClick={onShowQr} className="cursor-pointer w-[54px]">
                            <Image src={'/images/icon/ic_qr_1.png'} width="54px" height="54px" alt="Nami Exchange" />
                        </div>
                    </div>
                    <div className="text-left lg:text-right flex-1  p-3">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark leading-[1.19] text-[32px] font-semibold mb-4">
                            {t('home:intro_app.title')}
                        </div>
                        <div className="dark:text-txtSecondary-dark text-gray-9">{t('home:intro_app.description')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeLightDark;
