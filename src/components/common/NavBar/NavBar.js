import PocketNavDrawer from 'components/common/NavBar/PocketNavDrawer';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import useLanguage from 'hooks/useLanguage'
import SvgIcon from 'components/svg'
import SvgMoon from 'components/svg/Moon'
import SvgUser from 'components/svg/SvgUser'
import SvgMenu from 'components/svg/Menu'
import SvgSun from 'components/svg/Sun'
import Button from 'components/common/Button'
import colors from 'styles/colors'
import Image from 'next/image'
import Link from 'next/link'

import { useState, useMemo, useCallback } from 'react'
import { NAV_DATA, SPOTLIGHT } from 'components/common/NavBar/constants'
import { useTranslation } from 'next-i18next'
import { useWindowSize } from 'utils/customHooks'
import { useSelector } from 'react-redux'
import { log } from 'utils'
import NotificationList from 'components/notification/NotificationList'
import { getLoginUrl } from 'redux/actions/utils';


export const NAVBAR_USE_TYPE = {
    FLUENT: 'fluent',
    LIGHT: THEME_MODE.LIGHT,
    DARK: THEME_MODE.DARK,
}

const NavBar = ({ style, layoutStateHandler, useOnly }) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) => set(prevState => ({...prevState, ..._state}));

    // * Use hooks
    const [currentTheme, onThemeSwitch] = useDarkMode()
    const [currentLocale, onChangeLang] = useLanguage()

    const { user: auth } = useSelector(state => state.auth) || null
    const { width } = useWindowSize()
    const { t } = useTranslation(['navbar', 'common'])

    // * Memmoized Variable
    const navTheme = useMemo(() => {
        const result = { wrapper: '', text: '', color: '' }
        switch (useOnly) {
            case NAVBAR_USE_TYPE.FLUENT:
                result.wrapper = ''
                result.text = 'text-textPrimary-dark'
                result.color = colors.grey4
                break
            case NAVBAR_USE_TYPE.DARK:
                result.wrapper = 'mal-navbar__wrapper__use__dark'
                result.text = 'text-textPrimary-dark'
                result.color = colors.grey4
                break
            case NAVBAR_USE_TYPE.LIGHT:
                result.wrapper = 'mal-navbar__wrapper__use__light'
                result.text = 'text-textPrimary'
                result.color = colors.darkBlue
                break
            default:
                result.wrapper = 'mal-navbar__wrapper__no__blur'
                result.text = 'text-textPrimary dark:text-textPrimary-dark'
                result.color = currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4
                break
        }

        return result
    }, [useOnly, currentTheme])


    // * Helper
    const onDrawerAction = (status) => {
        setState({isDrawer: status});
        layoutStateHandler && layoutStateHandler({isDrawer: status})
    }

    // * Render Handler
    const renderDesktopNavItem = useCallback(() => {
        const feeNavObj = NAV_DATA.find(o => o.localized === 'fee')

        return NAV_DATA.map(item => {
            const { key, title, localized, isNew, url, child_lv1 } = item

            if (localized === 'fee' && width < 1200) return null

            if (localized === 'more') {
                if (width >= 1200) return null
                const child_clone = [...child_lv1]
                child_clone.push({ ...feeNavObj, key: 'fee_clone' })

                if (child_clone && child_clone.length) {
                    const itemsLevel1 = []
                    const shouldDot = child_clone.findIndex(o => o.isNew)

                    child_clone.map(child => {
                        itemsLevel1.push(
                            <Link href={child.url} key={`${child.title}_${child.key}`}>
                                <a className="mal-navbar__link__group___item___childen__lv1___item">
                                    {t(`navbar:menu.${child.localized}`)}
                                    {child.isNew && <div className="mal-dot__newest"/>}
                                </a>
                            </Link>
                        )
                    })

                    return (
                        <div className="h-full flex items-center"  key={`${title}_${key}__withchild`}>
                            <div className="mal-navbar__link__group___item">
                                <div className="flex items-center">
                                    {t(`navbar:menu.${localized}`)}
                                    {shouldDot !== -1 && shouldDot >= 0 && <div className="mal-dot__newest"/>}
                                </div>
                                <SvgIcon name="chevron_down" size={15} style={{paddingTop: 5, marginLeft: 8}}
                                         color="#F2F4F6"/>
                                <div className="mal-navbar__link__group___item___childen__lv1">
                                    {itemsLevel1}
                                </div>
                            </div>
                        </div>
                    )
                }
            }

            if (child_lv1 && child_lv1.length) {
                const itemsLevel1 = []
                const shouldDot = child_lv1.findIndex(o => o.isNew)

                child_lv1.map(child => {
                    itemsLevel1.push(
                        <Link href={child.url} key={`${child.title}_${child.key}`}>
                            <a className="mal-navbar__link__group___item___childen__lv1___item">
                                {t(`navbar:submenu.${child.localized}`)} {child.isNew && <div className="mal-dot__newest"/>}
                            </a>
                        </Link>
                    )
                })

                return (
                    <div className="h-full flex items-center" key={`${title}_${key}__withchild`}>
                        <div className="mal-navbar__link__group___item">
                            <div className="flex items-center">
                                {t(`navbar:menu.${localized}`)}
                                {shouldDot !== -1 && shouldDot >= 0 && <div className="mal-dot__newest"/>}
                            </div>
                            <SvgIcon name="chevron_down" size={15} style={{paddingTop: 5, marginLeft: 8}}
                                     color="#F2F4F6"/>
                            <div className="mal-navbar__link__group___item___childen__lv1">
                                {itemsLevel1}
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                <Link key={`${title}_${key}`} href={url}>
                    <a className="mal-navbar__link__group___item">
                        {t(`navbar:menu.${localized}`)} {isNew ? <div className="mal-dot__newest"/> : null}
                    </a>
                </Link>
            )
        })
    }, [width])

    return (
        <>
            <PocketNavDrawer isActive={state.isDrawer} onClose={() => onDrawerAction(false)}/>
            <div style={style || {}} className={`mal-navbar__wrapper ${navTheme.wrapper}`}>
                <Link href="/">
                    <a className="block mal-navbar__logo">
                        <Image src="/images/logo/nami_maldives.png" width="28" height="25"
                               className="navbar__logo" alt=""/>
                    </a>
                </Link>
                {width >= 992 &&
                <div className="mal-navbar__link__group pl-8">
                    {/*<SvgIcon name="hexagon" size={18}*/}
                    {/*         className="ml-16"*/}
                    {/*         onClick={() => console.log('namidev-DEBUG: should open product board')}/>*/}

                    {renderDesktopNavItem()}

                    {/*Link Spotlight*/}
                    {width >= 1200 && Object.keys(SPOTLIGHT).length ?
                    <Link href="/">
                        <a className="mal-navbar__link__spotlight">
                            {t(`navbar:menu.${SPOTLIGHT?.localized}`)}
                        </a>
                    </Link> : null}
                </div>
                }
                <div className="mal-navbar__hamburger">

                    {!auth && <div className="flex flex-row items-center mr-8">
                        {width >= 1366 &&
                        <Link href={getLoginUrl('sso', 'login')}>
                            <a className={`text-sm font-medium ${navTheme.text} whitespace-nowrap hover:!text-dominant`}>
                                {t('common:sign_in')}
                            </a>
                        </Link>}
                        {width >= 1090 &&
                        <Link href={getLoginUrl('sso', 'register')}>
                            <a className="text-sm font-medium text-dominant whitespace-nowrap ml-8 hover:underline">
                                {t('common:sign_up')}
                            </a>
                        </Link>}
                    </div>}

                    <Button title={t('navbar:menu.download_app')} type="primary"
                            style={width >= 992 ? {fontSize: 14, padding: '4px 16px', maxWidth: 120} : {fontSize: 12, padding: '1px 12px'}}
                            href="#nami_exchange_download_app"/>


                    {auth &&
                        <a href="https://nami.exchange/profile"
                           className="mal-navbar__user___avatar cursor-pointer">
                            {auth?.avatar ? <img src={auth?.avatar} alt=""/> :
                                <SvgUser size={25} className="ml-8 cursor-pointer"
                                         color={navTheme.color}
                                         onClick={() => console.log('should open user panel')}/>
                            }
                        </a>
                    }

                    <NotificationList btnClass="!mr-0"/>

                    {width >= 1366 &&
                    <div className="flex flex-row items-center ml-8">
                        <a className={`text-sm font-medium uppercase cursor-pointer ${navTheme.text} whitespace-nowrap hover:!text-dominant`}
                           onClick={onChangeLang}>
                            {currentLocale}
                        </a>
                        <a href="#" className="ml-8" onClick={onThemeSwitch}>
                            {currentTheme !== THEME_MODE.LIGHT ?
                                <SvgMoon size={20} color={navTheme.color}/>
                                : <SvgSun size={20} color={navTheme.color}/>}
                        </a>
                    </div>}

                    {width < 1366 &&
                    <div className="relative">
                        <SvgMenu size={25} className={`${width >= 768 ? 'ml-6' : 'ml-3'} cursor-pointer`}
                                 color={navTheme.color}
                                 onClick={() => onDrawerAction(true)}/>
                    </div>}
                </div>
            </div>
        </>
    )
}


export default NavBar
