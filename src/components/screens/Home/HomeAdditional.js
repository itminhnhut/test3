import HomeCurrentActivity from 'src/components/screens/Home/HomeCurrentActivity';
import Button from 'src/components/common/Button';
import colors from '../../../styles/colors';

import { useWindowSize } from 'utils/customHooks';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getLoginUrl, getS3Url, getV1Url } from 'redux/actions/utils';
import { useToggle } from 'react-use';
import HomeCommunity from './HomeCommunity';
import HomeJourney from './HomeJourney';
import HomeLightDark from './HomeLightDark';
import { THEME_MODE } from 'hooks/useDarkMode';

import HomeFirstAward from './HomeFirstAward';

const HomeAdditional = ({ parentState }) => {
    // * Initial State
    const [stepCount, setStepCount] = useState(0);
    const [state, set] = useState({
        focus: null
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // * Use Hooks
    const { width } = useWindowSize();
    const {
        t,
        i18n: { language }
    } = useTranslation(['home', 'input', 'common', 'navbar']);

    const theme = useSelector((state) => state.user.theme);

    useEffect(() => {
        let interval = setInterval(() => {
            setStepCount((lastTimerCount) => {
                if (lastTimerCount >= 2) {
                    setStepCount(0);
                }
                return lastTimerCount + 1;
            });
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="relative">
                <div className="absolute z-0 right-0 top-20 pointer-events-none">
                    <img src="/images/screen/homepage/right_up.png" className="" />
                </div>
                <div className="absolute z-0 bottom-0 left-0 pointer-events-none">
                    <img src="/images/screen/homepage/left_down.png" className="-mb-20" />
                    <img src="/images/screen/homepage/ghost_down.png" className="" />
                </div>
                <HomeJourney t={t} width={width} currentTheme={theme} />
                <section className="homepage-trade3step">
                    <div className="homepage-trade3step___wrapper relative mal-container">
                        <div className="homepage-trade3step___title">{t('home:trade3step.title')}</div>
                        <div className="homepage-trade3step___step___wrapper">
                            <div className="homepage-trade3step___step___item">
                                <div className="homepage-trade3step___step___item___inner">
                                    <img src={`/images/screen/homepage/create_account_${theme}.png`} width="48" />
                                    <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_1')}</div>
                                </div>
                                <div className="homepage-trade3step__vertial_dot_line" />
                                <div className="homepage-trade3step__horizontal_dot_line" />
                            </div>
                            <div className="homepage-trade3step___step___item">
                                <div className="homepage-trade3step___step___item___inner">
                                    <img src="/images/screen/homepage/fiat_crypto.png" width="48" />

                                    <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_2')}</div>
                                </div>
                                <div className="homepage-trade3step__vertial_dot_line" />
                                <div className="homepage-trade3step__horizontal_dot_line" />
                            </div>
                            <div className="homepage-trade3step___step___item">
                                <div className="homepage-trade3step___step___item___inner">
                                    <img src={`/images/screen/homepage/start_trading_${theme}.png`} width="48" />

                                    <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_3')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* <section className="homepage-whynami">
                <div className="homepage-whynami___wrapper mal-container">
                    <div className="homepage-whynami___title">
                        {t('home:why_nami.title')}
                        {width < 992 && <br />}
                        <span className="text-dominant"> Nami Exchange ?</span>
                    </div>
                    <div className="homepage-whynami___description">{t('home:why_nami.description')}</div>

                    <div className="homepage-whynami___reason__group">
                        <div className="homepage-whynami___reason__item">
                            <img src={getS3Url('/images/screen/homepage/registered_people.png')} width="52" height="52" />
                            <div className="homepage-whynami___reason__item___title">{t('home:why_nami.reason_1')}</div>
                            <div className="homepage-whynami___reason__item___description">{t('home:why_nami.reason_1_description')}</div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <img src={getS3Url('/images/screen/homepage/investment_diversity.png')} width="52" height="52" />
                            <div className="homepage-whynami___reason__item___title">{t('home:why_nami.reason_2')}</div>
                            <div className="homepage-whynami___reason__item___description">{t('home:why_nami.reason_2_description')}</div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <img src={getS3Url('/images/screen/homepage/fee_saving.png')} width="52" height="52" />
                            <div className="homepage-whynami___reason__item___title">{t('home:why_nami.reason_3')}</div>
                            <div className="homepage-whynami___reason__item___description">{t('home:why_nami.reason_3_description')}</div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <img src={getS3Url('/images/screen/homepage/effective_support.png')} width="52" height="52" />
                            <div className="homepage-whynami___reason__item___title">{t('home:why_nami.reason_4')}</div>
                            <div className="homepage-whynami___reason__item___description">
                                {t('home:why_nami.reason_4_description')}
                                
                            </div>
                        </div>
                    </div>

                    <div className="homepage-whynami___reason__group__btn___group">
                        
                    </div>
                </div>
            </section> */}

            <HomeCurrentActivity />

            <HomeLightDark t={t} onShowQr={() => parentState && parentState({ showQR: true })} />
            {/* <section id="nami_exchange_download_app" className="homepage-app_intro">
                <div className="homepage-app_intro___wrapper mal-container">
                    <div className="homepage-app_intro___content">
                        <div className="homepage-app_intro___content___title">
                            {t('home:intro_app.title_1')}
                            <br />
                            {t('home:intro_app.title_2')}
                        </div>
                        <div className="homepage-app_intro___content___description">{t('home:intro_app.description')}</div>
                        <div className="homepage-app_intro___content___button__group">
                            <div onClick={() => window.open('https://apps.apple.com/app/id1480302334', '_blank')}>
                                <img src={getS3Url('/images/screen/homepage/app_store_light.png')} alt="Nami Exchange" />
                            </div>
                            <div onClick={() => window.open('https://play.google.com/store/apps/details?id=com.namicorp.exchange', '_blank')}>
                                <img src={getS3Url('/images/screen/homepage/play_store_light.png')} alt="Nami Exchange" />
                            </div>
                            <div onClick={() => parentState && parentState({ showQR: true })}>
                                {theme && theme !== THEME_MODE.LIGHT ? (
                                    <img src={getS3Url('/images/icon/ic_qr.png')} alt="Nami Exchange" />
                                ) : (
                                    <img src={getS3Url('/images/screen/homepage/qr_light.png')} alt="Nami Exchange" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="homepage-app_intro___graphics">
                        <img
                            className="homepage-app_intro___mb_graphics"
                            src={getS3Url(`/images/screen/homepage/mobile_dual_ip_${theme === THEME_MODE.LIGHT ? 'light' : 'dark'}.png`)}
                            alt="Nami Exchange"
                        />
                        <img
                            className="homepage-app_intro___desktop_graphics"
                            src={getS3Url(`/images/screen/homepage/dual_ip_${theme === THEME_MODE.LIGHT ? 'light' : 'dark'}.png`)}
                            alt="Nami Exchange"
                        />
                    </div>
                    {theme && theme === THEME_MODE.LIGHT && (
                        <img
                            className="homepage-app_intro___graphics__backward"
                            src={getS3Url('/images/screen/homepage/corner_right.png')}
                            alt="Nami Exchange"
                        />
                    )}
                </div>
            </section> */}

            <HomeFirstAward theme={theme} t={t} language={language} />
            <HomeCommunity t={t} language={language} width={width} />
        </>
    );
};

export default HomeAdditional;
