import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import Div100vh from 'react-div-100vh'
import dynamic from 'next/dynamic'
import SvgIcon from 'components/svg'
import Button from 'components/common/Button'
import Image from 'next/image'
import Link from 'next/link'
import colors from 'styles/colors'

import { memo, useCallback, useEffect, useState } from 'react'
import { MOBILE_NAV_DATA } from 'components/common/NavBar/constants'
import { MoreHorizontal, ChevronDown } from 'react-feather'
import { useWindowSize } from 'utils/customHooks'
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'


const PocketNavDrawer = memo(({isActive, onClose}) => {
    const [state, set] = useState({
        navActiveLv1: {},
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { t } = useTranslation('navbar')
    const [currentTheme, onThemeSwitch] = useDarkMode()
    const {width} = useWindowSize()

    const renderNavItem = () => {
       return MOBILE_NAV_DATA.map(nav => {
           const { key, title, localized, isNew, url, child_lv1 } = nav

           if (child_lv1 && child_lv1.length) {

               const itemsLevel1 = []
               child_lv1.map(item => {
                   const { localized } = item
                   itemsLevel1.push(
                       <Link href={item.url} key={`${item.key}_${item.title}`}>
                           <a className="mal-pocket-navbar__drawer__navlink__group___item__lv1__item mal-pocket-nabar__item___hover"
                              onClick={() => onClose()}>
                               {getIcon(localized)}
                               <span className="ml-3 font-medium text-sm text-textSecondary dark:text-textSecondary-dark">
                                   {t(`submenu.${item.localized}`)}
                               </span>
                           </a>
                       </Link>
                   )
               })

               return (
                   <div key={`${title}_${key}`}>
                       <div className={`relative mal-pocket-navbar__drawer__navlink__group___item
                                    ${!state.navActiveLv1[`${title}_${key}`] ?
                                'mal-pocket-nabar__item___hover' : ''}`}
                            onClick={() => setState({navActiveLv1: { [`${title}_${key}`]: !state.navActiveLv1[`${title}_${key}`] } })}>
                           <div className="flex flex-row items-center">
                               {t(`menu.${localized}`)} {isNew && <span className="mal-dot__newest"/>}
                           </div>
                           <div className={`transition duration-200 ease-in-out ${state.navActiveLv1[`${title}_${key}`] ? 'rotate-180' : ''}`}>
                               <ChevronDown size={16}
                                            color={currentTheme !== THEME_MODE.LIGHT ? colors.grey4 : colors.darkBlue}/>
                           </div>
                       </div>
                       <div className={`mal-pocket-navbar__drawer__navlink__group___item__lv1
                                            ${state.navActiveLv1[`${title}_${key}`] ?
                           'mal-pocket-navbar__drawer__navlink__group___item__lv1__active' : ''}`}>
                           {itemsLevel1}
                       </div>
                   </div>
               )
           }
           return (
               <Link key={`${title}_${key}`} href={url}>
                   <a className="mal-pocket-navbar__drawer__navlink__group___item mal-pocket-nabar__item___hover" onClick={onClose}>
                       <div className="flex flex-row items-center">
                           {t(`menu.${localized}`)} {isNew && <span className="mal-dot__newest"/>}
                       </div>
                   </a>
               </Link>
           )
       })
    }

    // useEffect(() => {
    //     console.log('namidev-DEBUG: Watch Theme ', theme)
    // }, [theme])

    return (
        <>
            <div className={`mal-overlay ${isActive ? 'mal-overlay__active' : ''}`} onClick={onClose}/>
            <Div100vh className={`mal-pocket-navbar__drawer ${isActive ? 'mal-pocket-navbar__drawer__active' : ''}`}>
                <div className="flex justify-end">
                    <SvgIcon name="cross" size={20} style={{ cursor: 'pointer', marginRight: 16 }} onClick={onClose}/>
                </div>
                <div className="mal-pocket-navbar__drawer__content___wrapper">
                    <div className="flex flex-row justify-between user__button">
                        <div>
                            <Button href="/" title="Đăng nhập" type="secondary"/>
                        </div>
                        <div>
                            <Button href="/" title="Đăng kí" type="primary"/>
                        </div>
                    </div>
                    <div style={{paddingLeft: 16, paddingRight: 16, marginTop: 8, marginBottom: 16}}>

                    </div>
                    {width < 992 && <div className="mal-pocket-navbar__drawer__navlink__group">
                        {renderNavItem()}
                    </div>}
                    <div>
                        <a className="mal-pocket-navbar__drawer__navlink__group___item"
                           onClick={onThemeSwitch}>
                            <div className="flex flex-row items-center">
                                Chủ đề
                            </div>
                            <div>
                                {currentTheme === 'dark' ?
                                    <SvgIcon name="sun" size={18}/>
                                    : <SvgIcon name="moon" size={18}/>}
                            </div>
                        </a>
                        <a className="mal-pocket-navbar__drawer__navlink__group___item">
                            <div className="flex flex-row items-center">
                                Ngôn ngữ
                            </div>
                            <div>
                                <Image src="/images/icon/ic_vn_flag.png" width="20" height="20" />
                            </div>
                        </a>
                        <a className="mal-pocket-navbar__drawer__navlink__group___item">
                            <div className="flex flex-row items-center">
                                Tải ứng dụng
                            </div>
                        </a>
                        <div style={{padding: '16px 16px 0'}} className="flex flex-row items-center">
                            <Link href="/">
                                <a className="block">
                                    <img style={{height: 37, width: 'auto'}} src="/images/download_app_store.png" alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <Link href="/">
                                <a className="block ml-4">
                                    <img style={{height: 37, width: 'auto'}} src="/images/download_play_store.png" alt="Nami Exchange"/>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </Div100vh>
        </>
    )
})

const getIcon = (code) => {
    switch (code) {
        case 'market':
            return <SvgIcon name="activity" size={20} style={{marginRight: 8}}/>
        case 'spot':
            return <Image src="/images/icon/ic_exchange.png" width="32" height="32"/>
        case 'swap':
            return <Image src="/images/icon/ic_swap.png" width="32" height="32"/>
        case 'futures':
            return <Image src="/images/icon/ic_futures.png" width="32" height="32"/>
        case 'launchpad':
            return <Image src="/images/icon/ic_rocket.png" width="32" height="32"/>
        case 'copytrade':
            return <Image src="/images/icon/ic_copytrade.png" width="32" height="32"/>
        case 'staking':
            return <Image src="/images/icon/ic_staking.png" width="32" height="32"/>
        case 'farming':
            return <Image src="/images/icon/ic_farming.png" width="32" height="32"/>
        case 'referral':
            return <Image src="/images/icon/ic_referral.png" width="32" height="32"/>
        case 'language':
            return <SvgIcon name="globe" size={18} style={{marginRight: 8, marginLeft: 2}}/>
        case 'moon':
            return <SvgIcon name="moon" size={20} style={{marginRight: 8}}/>
        case 'sun':
            return <SvgIcon name="sun" size={20} style={{marginRight: 8}}/>
        default:
            return null
    }
}

export default PocketNavDrawer
