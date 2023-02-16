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
import { getS3Url } from 'redux/actions/utils';

const SwitchTheme = ({ currentTheme, changeTheme }) => {
    const [active, toggleActive] = useToggle(false);

    // toggle state on theme change
    useEffect(() => toggleActive(), [currentTheme]);

    const onChange = () => {
        changeTheme();
    };
    return (
        <div
            className={'relative  w-[90px] h-[44px] rounded-full cursor-pointer bg-dark-dark bg-teal-lightTeal dark:bg-teal '}
            onClick={() => onChange && onChange()}
        >
            <div
                className={`absolute w-[36px] h-[36px] top-1/2 -translate-y-1/2 rounded-full  bg-white dark:!bg-white flex items-center justify-center duration-100 ease-in ${
                    active ? ` left-1` : `left-[calc(100%-4px)] -translate-x-full`
                }`}
            >
                {currentTheme !== THEME_MODE.LIGHT ? <SvgMoon size={20} color={colors.teal} /> : <SvgSun size={20} color={colors.darkBlue3} />}
            </div>
        </div>
    );
};

const HomeLightDark = ({ onShowQr, t }) => {
    const [currentTheme, onThemeSwitch] = useDarkMode();

    return (
        <div className="dark:bg-dark-dark bg-white relative py-[120px]">
            <div className="mal-container px-4 relative">
                <div className="flex justify-center mb-[70px]">
                    <div>
                        <div className="text-sm tooltip-arrow-bottom mb-[30px] justify-center items-center py-3 px-6 inline-flex animate-bounce	 rounded-full">
                            Thử ngay{' '}
                        </div>
                        <div className="flex justify-center">
                            <SwitchTheme currentTheme={currentTheme} changeTheme={onThemeSwitch} />
                        </div>
                    </div>
                </div>

                <div className="grid relative bg-transparent lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:justify-start justify-center lg:gap-[30px] gap-5">
                    {[...Array(5).keys()].map((_, index) => (
                        <div key={index} className=" h-[433px]">
                            <div className="relative rounded-[35px] border-gray bg-dark-dark  dark:border-white border-2 overflow-hidden w-full h-full">
                                {/* <img src="/images/screen/homepage/iphone_frame.png" className="w-full z-10 h-full absolute top-0 left-0" alt="iphone" /> */}

                                <img
                                    src={`/images/screen/homepage/iphone_${index + 1}.png`}
                                    className="w-full p-1 h-full " //absolute top-0 left-0"
                                    alt="iphone"
                                />
                            </div>
                        </div>
                    ))}
                    <div
                        className="absolute left-1/2 top-0 w-full z-[1000]"
                        style={{
                            // background: `linear-gradient(261.62deg, #1ED776 11.3%, rgba(70, 201, 132, 0.634684) 16.12%, rgba(70, 201, 132, 0) 63.76%)`,
                            filter: ' blur(36.2056px)',
                            background: 'red',
                            transform: 'matrix(0.91, 0.4, -0.86, 0.5, 0, 0)'
                        }}
                    ></div>
                </div>
                <div className="flex px-4 justify-between -m-3 flex-col-reverse md:flex-row items-center pt-[90px]">
                    <div className="flex flex-wrap justify-center md:justify-start flex-row items-center gap-4 w-full md:flex-1 p-3">
                        <GradientButton className="py-2 px-6 w-auto">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a style={{ color: 'inherit' }} className="text-inherit flex items-center justify-center">
                                    <AppleIcon color={currentTheme === THEME_MODE.DARK ? '#fff' : '#000'} />

                                    <div className="ml-3">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">App Store</div>
                                    </div>
                                </a>
                            </Link>
                        </GradientButton>
                        <GradientButton className="py-2 px-6 w-auto hover:from-white hover:to-white">
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
                        <div onClick={onShowQr} className="cursor-pointer">
                            {currentTheme !== THEME_MODE.LIGHT ? (
                                <img src={getS3Url('/images/icon/ic_qr.png')} width="44" alt="Nami Exchange" />
                            ) : (
                                <img src={getS3Url('/images/screen/homepage/qr_light.png')} width="44" alt="Nami Exchange" />
                            )}
                        </div>
                    </div>
                    <div className="text-center md:text-right   p-3">
                        <div className="text-[#1F2633] md:w-[610px] dark:text-txtPrimary-dark text-[32px] leading-[38px] font-semibold mb-4">
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
