import HomeCurrentActivity from 'version/maldives/v0.1/HomePage/HomeCurrentActivity'
import Button from 'components/common/Button'
import Image from 'next/image'
import Link from 'next/link'

import { Eye, Lock, Mail } from 'react-feather'
import { useWindowSize } from 'utils/customHooks'
import { useSelector } from 'react-redux'
import { THEME_MODE } from 'hooks/useDarkMode'
import { useTranslation } from 'next-i18next'
import { LANGUAGE_TAG } from 'hooks/useLanguage'
import { useEffect, useState } from 'react'

const HomeAdditional = ({ parentState }) => {
    // * Initial State
    const [stepCount, setStepCount] = useState(0)
    const [state, set] = useState({})
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    // * Use Hooks
    const { width } = useWindowSize()
    const { t, i18n: { language }  } = useTranslation(['home', 'input', 'common', 'navbar'])

    const theme = useSelector(state => state.user.theme)

    useEffect(() => {
        let interval = setInterval(() => {
            setStepCount((lastTimerCount) => {
                if (lastTimerCount >= 2) {
                    setStepCount(0)
                }
                return lastTimerCount + 1
            });
        }, 2800)
        return () => clearInterval(interval)
    }, [])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: ', stepCount)
    // }, [stepCount])


    return (
        <>
            <section className="homepage-first_award">
                <div className="homepage-first_award__wrapper mal-container">
                    <div className="homepage-first_award___step">
                        <div className="homepage-first_award__title">
                            {language === LANGUAGE_TAG.VI ?
                            <>Sở hữu ngay <span>50 USDT</span> đầu</>
                            : <>Own The First <span>50 USDT</span> In</>}
                            {width >= 1280 && <br/>}
                            {t('home:first_award.title_2')}
                        </div>
                        <div className="homepage-first_award__manual">
                            <div className="homepage-first_award__manual__item">
                                {t('home:first_award.rule_1')}
                            </div>
                            <div className="homepage-first_award__manual__item">
                                {t('home:first_award.rule_2')}
                            </div>
                            <div className="homepage-first_award__manual__item">
                                {t('home:first_award.rule_3')}
                            </div>
                            <div className="homepage-first_award__manual__item">
                                {t('home:first_award.following_at')}
                                <div className="flex flex-row items-center">
                                    <Link href="/">
                                        <a>
                                            <Image src="/images/icon/ic_facebook.png" width={width >= 768 ? '52' : '32'}
                                                   height={width >= 768 ? '52' : '32'}/>
                                        </a>
                                    </Link>
                                    <Link href="/">
                                        <a>
                                            <Image src="/images/icon/ic_twitter.png" width={width >= 768 ? '52' : '32'}
                                                   height={width >= 768 ? '52' : '32'}/>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-first_award___form">
                        <div className="homepage-first_award___form___title">
                            {t('home:first_award.join_nami_by')}
                        </div>
                        <div className="homepage-first_award___form___platform">
                            <Link href="/">
                                <a>
                                    <Image src="/images/screen/homepage/Facebook.png" width="52" height="52"/>
                                </a>
                            </Link>
                            <Link href="/">
                                <a>
                                    <Image src="/images/screen/homepage/Apple.png" width="52" height="52"/>
                                </a>
                            </Link>
                            <Link href="/">
                                <a>
                                    <Image src="/images/screen/homepage/Google.png" width="52" height="52"/>
                                </a>
                            </Link>
                        </div>
                        <div className="homepage-first_award___form___or">
                            {language === LANGUAGE_TAG.VI ? 'hoặc' : 'or'}
                        </div>
                        <div className="homepage-first_award___form___input_group">
                            <div className="homepage-first_award___form___input__wrapper">
                                <Mail size={16}/>
                                <input className="homepage-first_award___form___input"
                                       placeholder={t('input:email_placeholder')}/>
                            </div>
                            <div style={{ marginTop: 12 }} className="homepage-first_award___form___input__wrapper">
                                <Lock size={20}/>
                                <input className="homepage-first_award___form___input"
                                       placeholder={t('input:password_placeholder')}/>
                                <Eye size={16}/>
                            </div>
                            <div>
                                <Button style={{
                                    marginTop: 28,
                                    borderRadius: 12,
                                    fontSize: 14,
                                    height: 48,
                                    lineHeight: '35px'
                                }}
                                        title={t('common:sign_up')}
                                        type="primary"/>
                            </div>
                            <div
                                className="text-sm text-center text-textSecondary dark:text-textSecondary-dark font-medium mt-3">
                                {t('common:already_have_account')} <Link href="/"><a className="text-dominant">{t('common:sign_in')}</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="homepage-journey">
                <div className="homepage-journey__wrapper mal-container">
                    <div className="homepage-journey__title">
                        {t('home:journey.title')}
                    </div>
                    <div className="homepage-journey__description">
                        {width >= 992 ?
                            <>
                                {t('home:journey.description_desktop1')}<br/>{t('home:journey.description_desktop2')}
                            </>
                            : t('home:journey.description_mobile')
                        }
                    </div>
                    <div className="homepage-journey__group_content">
                        <div className="homepage-journey__group_content___left">
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/maxium_performance.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        {t('home:journey.reason_1')}
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        {t('home:journey.reason_1_description')}
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title={t('common:read_more')} type="primary"/>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/master_revenue.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        {t('home:journey.reason_2')}
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        {t('home:journey.reason_2_description')}
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title={t('common:read_more')} type="primary"/>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/token_saving_cost.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        {t('home:journey.reason_3')}
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        {t('home:journey.reason_3_description')}
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title={t('common:read_more')} type="primary"/>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/crypto_knowledge.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        {t('home:journey.reason_4')}
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        {t('home:journey.reason_4_description')}
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title={t('common:read_more')} type="primary"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="homepage-journey__group_content___right">
                            <img src="/images/screen/homepage/journey_graphics2.png" alt="Nami Exchange"/>
                        </div>
                    </div>
                </div>
            </section>

            <section id="nami_exchange_download_app" className="homepage-app_intro">
                <div className="homepage-app_intro___wrapper mal-container">
                    <div className="homepage-app_intro___content">
                        <div className="homepage-app_intro___content___title">
                            {t('home:intro_app.title_1')}<br/>
                            {t('home:intro_app.title_2')}</div>
                        <div className="homepage-app_intro___content___description">
                            {t('home:intro_app.description')}
                        </div>
                        <div className="homepage-app_intro___content___button__group">
                            <div onClick={() => window.open('https://apps.apple.com/app/id1480302334', '_blank')}>
                                <img src="/images/screen/homepage/app_store_light.png" alt="Nami Exchange"/>
                            </div>
                            <div onClick={() => window.open('https://play.google.com/store/apps/details?id=com.namicorp.exchange', '_blank')}>
                                <img src="/images/screen/homepage/play_store_light.png" alt="Nami Exchange"/>
                            </div>
                            <div onClick={() => parentState && parentState({ showQR: true })}>
                                {theme && theme !== THEME_MODE.LIGHT ?
                                 <img src="/images/icon/ic_qr.png" alt="Nami Exchange"/>
                                 : <img src="/images/screen/homepage/qr_light.png" alt="Nami Exchange"/>}
                            </div>
                        </div>
                    </div>
                    <div className="homepage-app_intro___graphics">
                        <img className="homepage-app_intro___mb_graphics" src="/images/screen/homepage/mobile_dual_ip_light.png" alt="Nami Exchange"/>
                        <img className="homepage-app_intro___desktop_graphics" src="/images/screen/homepage/dual_ip_light.png" alt="Nami Exchange"/>
                    </div>
                    {theme && theme === THEME_MODE.LIGHT &&
                    <img className="homepage-app_intro___graphics__backward"
                         src="/images/screen/homepage/corner_right.png" alt="Nami Exchange"/>}
                </div>
            </section>

            <section className="homepage-trade3step">
                <div className="homepage-trade3step___wrapper">
                    <div className="homepage-trade3step___title">
                        {t('home:trade3step.title')}
                    </div>

                    <div className="homepage-trade3step___step___wrapper">
                        <div className="homepage-trade3step___step___item">
                            <div className="homepage-trade3step___step___item___inner">
                                <div className={`homepage-trade3step___step___item__label ${stepCount === 0 ? 'text-get-teal transition-all duration-300 ease-in-out' : ''}`}>01</div>
                                <div className="homepage-trade3step___step___item__sublabel">
                                    {t('home:trade3step.step_1')}
                                </div>
                            </div>
                            <div className="homepage-trade3step__vertial_dot_line"/>
                            <div className="homepage-trade3step__horizontal_dot_line"/>
                        </div>
                        <div className="homepage-trade3step___step___item">
                            <div className="homepage-trade3step___step___item___inner">
                                <div className={`homepage-trade3step___step___item__label ${stepCount === 1 ? 'text-get-teal transition-all duration-300 ease-in-out' : ''}`}>02</div>
                                <div className="homepage-trade3step___step___item__sublabel">
                                    {t('home:trade3step.step_2')}
                                </div>
                            </div>
                            <div className="homepage-trade3step__vertial_dot_line"/>
                            <div className="homepage-trade3step__horizontal_dot_line"/>
                        </div>
                        <div className="homepage-trade3step___step___item">
                           <div className="homepage-trade3step___step___item___inner">
                               <div className={`homepage-trade3step___step___item__label ${stepCount === 2 ? 'text-get-teal transition-all duration-300 ease-in-out' : ''}`}>03</div>
                               <div className="homepage-trade3step___step___item__sublabel">
                                   {t('home:trade3step.step_3')}
                               </div>
                           </div>
                        </div>
                    </div>

                    <div className="homepage-trade3step___create_account">
                        <Button title={t('common:create_account')} type="primary"/>
                        <div className="homepage-trade3step___create_account___pr">
                            {t('home:trade3step.chill_a_bit')}
                        </div>
                    </div>
                </div>
            </section>

            <section className="homepage-whynami">
                <div className="homepage-whynami___wrapper mal-container">
                    <div className="homepage-whynami___title">
                        {t('home:why_nami.title')}
                        {width < 992 && <br/>}
                        <span className="text-dominant"> Nami Exchange ?</span>
                    </div>
                    <div className="homepage-whynami___description">
                        {t('home:why_nami.description')}
                    </div>

                    <div className="homepage-whynami___reason__group">
                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/registered_people.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                {t('home:why_nami.reason_1')}
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                {t('home:why_nami.reason_1_description')}
                            </div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/investment_diversity.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                {t('home:why_nami.reason_2')}
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                {t('home:why_nami.reason_2_description')}
                            </div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/fee_saving.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                {t('home:why_nami.reason_3')}
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                {t('home:why_nami.reason_3_description')}
                            </div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/effective_support.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                {t('home:why_nami.reason_4')}
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                {t('home:why_nami.reason_4_description')}
                                {/*Luôn có nhân viên hỗ trợ trực tiếp<br/>*/}
                                {/*đa ngôn ngữ 24/7*/}
                            </div>
                        </div>
                    </div>

                    <div className="homepage-whynami___reason__group__btn___group">
                        <Button title={t('navbar:menu.about')} type="primary"/>
                    </div>
                </div>
            </section>

            <HomeCurrentActivity/>

            <section className="homepage-community">
                <div className="homepage-community___wrapper mal-container">
                    <div className="homepage-community___title">
                        {t('home:community.title')}
                    </div>
                    <div className="homepage-community___description">
                        {width >= 992 ?
                            <>
                                {t('home:community.description_desktop1')}<br/>{t('home:community.description_desktop2')}
                            </>
                            : t('home:community.description_mobile')}
                    </div>
                    <div className="homepage-community___channel__group">
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_facebook.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Facebook
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_facebook.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Facebook Group
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_telegram.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Telegram Global
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_telegram.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Telegram
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_twitter.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Twitter
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_reddit.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Reddit
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_globe.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Blog
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_cmc.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    CoinMarketCap
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomeAdditional
