import React, { useEffect } from 'react';
import Link from 'next/link';
import { AppleIcon, GooglePlayIcon } from '../../svg/SvgIcon';
import { useTranslation } from 'next-i18next';
import GradientButton from '../../common/V2/ButtonV2/GradientButton';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import colors from '../../../styles/colors';
import { useToggle } from 'react-use';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const SwitchTheme = ({ currentTheme, changeTheme }) => {
    const [active, toggleActive] = useToggle(currentTheme === THEME_MODE.DARK ? true : false);

    // toggle state on theme change
    useEffect(() => toggleActive(), [currentTheme]);

    const onChange = () => {
        changeTheme();
    };
    return (
        <div className={'relative  w-[90px] h-[44px] rounded-full cursor-pointer bg-gray-11 dark:bg-dark-2 '} onClick={() => onChange && onChange()}>
            <div
                className={`absolute w-[36px] h-[36px] top-1/2 -translate-y-1/2 rounded-full  bg-teal flex items-center justify-center duration-100 ease-in ${
                    active ? ` left-1` : `left-[calc(100%-4px)] -translate-x-full`
                }`}
            >
                {currentTheme !== THEME_MODE.LIGHT ? <SvgMoon size={20} color={colors.gray[1]} /> : <SvgSun size={20} color={colors.gray[11]} />}
            </div>
        </div>
    );
};

const HomeLightDark = ({ onShowQr, t }) => {
    const [currentTheme, onThemeSwitch] = useDarkMode();

    return (
        <div  className="dark:bg-dark-dark bg-white m relative py-[120px]">
            <div className="mal-container px-4 md:px-0 ax-w-[1216px] relative">
                <div className="flex justify-center mb-[70px] z-1000">
                    <div>
                        <div className="text-sm tooltip-arrow-bottom mb-[30px] justify-center items-center py-3 px-6 inline-flex animate-bounce	 rounded-full">
                            Thử ngay{' '}
                        </div>
                        <div className="flex justify-center ">
                            <SwitchTheme currentTheme={currentTheme} changeTheme={onThemeSwitch} />
                        </div>
                    </div>
                </div>

                <div className="relative bg-transparent">
                    <img src="/images/screen/homepage/splash_dark.png" className="w-full absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 " />
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1.5}
                        centeredSlides
                        loop
                        allowTouchMove
                        breakpoints={{
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                                centeredSlides: false,
                                allowTouchMove: true
                            },

                            1440: {
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
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                    >
                        {[...Array(5).keys()].map((_, index) => (
                            <SwiperSlide key={index} className="">
                                <div className="relative  overflow-hidden w-full h-full">
                                    <img src={`/images/screen/homepage/iphone_${index + 1}_${currentTheme}.png`} className="w-full p-1 h-full " alt="iphone" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div id="download_section" className="flex px-4 justify-between  -m-3 flex-col-reverse md:flex-row md:items-center pt-[90px]">
                    <div className="flex flex-wrap items-center gap-4 w-full md:flex-1 p-3">
                        <GradientButton className="text-left py-2 px-6 w-auto">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a style={{ color: 'inherit' }} className="text-inherit flex items-center justify-center">
                                    <AppleIcon color="currentColor" />

                                    <div className="ml-3">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">App Store</div>
                                    </div>
                                </a>
                            </Link>
                        </GradientButton>
                        <GradientButton className="text-left py-2 px-6 w-auto">
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a style={{ color: 'inherit' }} className="text-inherit flex items-center justify-center">
                                    <GooglePlayIcon />

                                    <div className="ml-3">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">Google Play</div>
                                    </div>
                                </a>
                            </Link>
                        </GradientButton>
                        <div onClick={onShowQr} className="cursor-pointer flex-1">
                            <img src={'/images/icon/ic_qr_1.png'} width="54" alt="Nami Exchange" />

                            {/* {currentTheme !== THEME_MODE.LIGHT ? (
                                <img src={getS3Url('/images/icon/ic_qr.png')} width="44" alt="Nami Exchange" />
                            ) : (
                                <img src={getS3Url('/images/screen/homepage/qr_light.png')} width="44" alt="Nami Exchange" />
                            )} */}
                        </div>
                    </div>
                    <div className="text-left md:text-right   p-3">
                        <div className="text-txtPrimary md:max-w-[610px] dark:text-txtPrimary-dark leading-[1.19] text-[32px] font-semibold mb-4">
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
