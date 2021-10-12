import PocketNavDrawer from 'components/common/NavBar/PocketNavDrawer';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import SvgIcon from 'components/svg'
import SvgMoon from 'components/svg/Moon'
import SvgUser from 'components/svg/SvgUser'
import SvgMenu from 'components/svg/Menu';
import SvgSun from 'components/svg/Sun'
import Button from 'components/common/Button'
import colors from 'styles/colors'
import Image from 'next/image'
import Link from 'next/link'

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next'
import { useWindowSize } from 'utils/customHooks'
import { useSelector } from 'react-redux'
import { NAV_DATA } from 'components/common/NavBar/constants'


const NavBar = ({ style, layoutStateHandler, useBlur }) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) => set(prevState => ({...prevState, ..._state}));

    // * Use hooks
    const [currentTheme, onThemeSwitch] = useDarkMode()
    const { user: auth } = useSelector(state => state.auth) || null
    const { width } = useWindowSize()
    const { t } = useTranslation(['navbar'])

    // * Helper
    const onDrawerAction = (status) => {
        setState({isDrawer: status});
        layoutStateHandler && layoutStateHandler({isDrawer: status})
    }

    // * Render Handler
    const renderDesktopNavItem = () => {
        return NAV_DATA.map(item => {
            const { key, title, localized, isNew, url, child_lv1 } = item

            if (localized === 'product') return null

            if (child_lv1 && child_lv1.length) {
                const itemsLevel1 = []
                child_lv1.map(child => {
                    itemsLevel1.push(
                        <Link href={child.url} key={`${child.title}_${child.key}`}>
                            <a className="mal-navbar__link__group___item___childen__lv1___item">
                                {child.localized}
                            </a>
                        </Link>
                    )
                })

                return (
                    <Link key={`${title}_${key}__withchild`} href={url}>
                        <div className="flex flex-row items-center mal-navbar__link__group___item">
                            {localized}
                            <SvgIcon name="chevron_down" size={15} style={{paddingTop: 5, marginLeft: 8}}
                                     color="#F2F4F6"/>
                            <div className="mal-navbar__link__group___item___childen__lv1">
                                {itemsLevel1}
                            </div>
                        </div>
                    </Link>
                )
            }

            return (
                <Link key={`${title}_${key}`} href={url}>
                    <a className="mal-navbar__link__group___item">
                        {localized}
                    </a>
                </Link>
            )
        })
    }

    return (
        <>
            <PocketNavDrawer isActive={state.isDrawer} onClose={() => onDrawerAction(false)}/>
            <div style={style || {}} className={`mal-navbar__wrapper ${!useBlur ? 'mal-navbar__wrapper__no__blur' : ''}`}>
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
                    {width >= 1200 &&
                    <Link href="/">
                        <a className="mal-navbar__link__spotlight">
                            Spotlight
                        </a>
                    </Link>}
                </div>
                }
                <div className="mal-navbar__hamburger">

                    <div className="flex flex-row items-center mr-8">
                        {width >= 1366 &&
                        <Link href="/">
                            <a className="text-sm font-medium text-textPrimary-dark whitespace-nowrap hover:text-dominant">Đăng nhập</a>
                        </Link>}
                        {width >= 1090 &&
                        <Link href="/">
                            <a className="text-sm font-medium text-dominant whitespace-nowrap ml-8 hover:underline">Đăng kí</a>
                        </Link>}
                    </div>

                    <Button title="Tải ứng dụng" type="primary"
                            style={width >= 992 ? {fontSize: 14, padding: '4px 16px', maxWidth: 120} : {fontSize: 12, padding: '1px 12px'}}
                            href="#nami_exchange_download_app"/>

                    {width >= 1366 &&
                    <div className="flex flex-row items-center ml-8">
                        <Link href="/">
                            <a className="text-sm font-medium text-textPrimary-dark">VI</a>
                        </Link>
                        <a href="#" className="text-sm font-medium text-textPrimary-dark ml-8" onClick={onThemeSwitch}>
                            {currentTheme === THEME_MODE.LIGHT ? <SvgMoon size={20} color={colors.grey4}/> : <SvgSun size={20} color={colors.grey4}/>}
                        </a>
                    </div>}

                    {auth &&
                    <SvgUser size={25} style={{marginLeft: 18, cursor: 'pointer'}}
                             color={useBlur ? colors.grey4 : currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4}
                             onClick={() => console.log('should open user panel')}/>}

                    {width < 1366 &&
                    <SvgMenu size={25} style={{marginLeft: 18, cursor: 'pointer'}}
                             color={useBlur ? colors.grey4 : currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4}
                             onClick={() => onDrawerAction(true)}/>}
                </div>
            </div>
        </>
    )
}

export default NavBar
