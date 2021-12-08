import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { API_GET_LOGIN_LOG, API_GET_VIP, API_SET_ASSET_AS_FEE } from 'redux/actions/apis'
import { BREAK_POINTS, EMPTY_VALUE, FEE_TABLE, ROOT_TOKEN } from 'constants/constants'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChevronRight } from 'react-feather'
import { TAB_ROUTES } from 'components/common/layouts/withTabLayout'
import { ApiStatus } from 'redux/actions/const'
import { LANGUAGE_TAG } from 'hooks/useLanguage'
import { orderBy } from 'lodash'
import { PATHS } from 'constants/paths'
import { log } from 'utils'

import withTabLayout from 'components/common/layouts/withTabLayout'
import useDarkMode, { THEME_MODE }  from 'hooks/useDarkMode'
import SvgCheckSuccess from 'components/svg/CheckSuccess'
import SvgGooglePlus from 'components/svg/SvgGooglePlus'
import SvgFacebook from 'components/svg/SvgFacebook'
import SvgTwitter from 'components/svg/SvgTwitter'
import SvgApple from 'components/svg/SvgApple'
import Skeletor from 'components/common/Skeletor'
import useWindowSize from 'hooks/useWindowSize'
import MCard from 'components/common/MCard'
import Link from 'next/link'
import NeedLogin from 'components/common/NeedLogin'
import Tooltip from 'components/common/Tooltip'
import Switcher from 'components/common/Switcher'
import Axios from 'axios'

const DEFAULT_USER = {
    name: '',
    username: '',
    phone: '',
}

const INITIAL_STATE = {
    useNami: false,
    level: null,
    loadingLevel: false,
    isEditable: false,
    savingInfo: false,
    user: DEFAULT_USER,
    loadingActivity: false,
    activitiesLog: null,
    loadingAnnouncements: false,
    announcements: null,
    assetFee: null,
    promoteFee: null,
    loadingAssetFee: false,

    // ... Add new state
}

const AccountProfile = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    const firstInputRef = useRef()

    // Rdx
    const user = useSelector(state => state.auth?.user)
    const namiWallets = useSelector(state => state.wallet?.SPOT)?.['1']

    // Use Hooks
    const { t, i18n: { language } } = useTranslation()
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()

    // Helper
    const onUseAssetAsFee = async (action = 'get', currency = undefined, assetCode = 'NAMI') => {
        const throttle = 800
        setState({ loadingAssetFee: true })

        try {
            if (action === 'get') {
                const { data } = await Axios.get(API_SET_ASSET_AS_FEE)
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setTimeout(() => {
                        setState({ assetFee: data.data, promoteFee: { exchange: data?.data?.promoteSpot, futures: data?.data?.promoteFutures } })
                    }, throttle)
                }
            }
            if (action === 'set' && currency !== undefined) {
                const { data } = await Axios.post(API_SET_ASSET_AS_FEE, { currency })
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setTimeout(() => setState({ assetFee: data.data }), throttle)
                }
            }
        } catch (e) {
            console.log(`Can't ${action} ${assetCode} as asset fee `, e)
        } finally {
            setTimeout(() => setState({ loadingAssetFee: false }), throttle)
        }
    }

    const getAnnouncements = async (lang = 'vi') => {
        setState({ loadingAnnouncements: false })
        try {
            const { status, data: announcements } = await Axios.get(`https://nami.io/api/v1/top_posts?language=${lang}`)
            if (status === 200 && announcements) {
                setState({ announcements })
            }
        } catch (e) {
            console.log(`Can't get announcements `, e)
        } finally {
            setState({ loadingAnnouncements: false })
        }
    }

    const getLevel = async () => {
        setState({ loadingLevel: true })
        try {
            const { data } = await Axios.get(API_GET_VIP)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ level: data?.data?.level })
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`)
        } finally {
            setState({ loadingLevel: false })
        }
    }

    const getLoginLogs = async () => {
        !state.activitiesLog &&
        setState({ loadingActivity: true })
        try {
            const { data } = await Axios.get(API_GET_LOGIN_LOG)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ activitiesLog: data.data })
            }
        } catch (e) {
            console.log(`Can't get activities log `, e)
        } finally {
            setState({ loadingActivity: false })
        }
    }

    // const onEdit = () => {
    //     setState({ isEditable: true })
    //     firstInputRef.current?.focus()
    // }
    //
    // const onSave = (payload) => {
    //     setState({ savingInfo: true })
    //     setState({ user: { ...state.user, ...payload } })
    //     setTimeout(() => {
    //         setState({ savingInfo: false, isEditable: false })
    //     }, 1500)
    // }

    // Render Handler
    const renderUserPersona = useCallback(() => {
        if (!user) return null

        return (
            <div className="flex flex-col items-center w-full lg:w-2/5 xl:w-[15%]">
                <div className="w-[132px] h-[132px] rounded-full overflow-hidden bg-gray-4 dark:bg-darkBlue-5">
                    <img src={user?.avatar} alt="Nami.Exchange"
                         className="w-full h-full"/>
                </div>
                <div className="mt-5 mb-2.5 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    Social Binding
                </div>
                <div className="flex items-center">
                    <div className="mr-2 cursor-pointer hover:opacity-90">
                        <SvgApple/>
                    </div>
                    <div className="mr-2 cursor-pointer hover:opacity-90">
                        <SvgGooglePlus/>
                    </div>
                    <div className="mr-2 cursor-pointer hover:opacity-90">
                        <SvgFacebook/>
                    </div>
                    <div className="mr-2 cursor-pointer hover:opacity-90">
                        <SvgTwitter/>
                    </div>
                </div>
            </div>
        )
    }, [user])

    const renderUserInfo = useCallback(() => {
        const inputClass = `font-medium text-txtPrimary dark:text-txtPrimary-dark 
                             text-right pr-3 rounded-md xl:ml-8
                             ${state.isEditable ? 'py-1 bg-gray-4 dark:bg-darkBlue-4' : ''} 
                             ${state.savingInfo ? 'opacity-30 pointer-event-none' : ''}`

        const { name, username, phone } = state.user

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                { width: `calc(80% / 3)` } : undefined}
                 className="w-full lg:w-3/5">
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                        {t('profile:username')}
                    </span>
                    <input className={inputClass}
                           value={username}
                           ref={firstInputRef}
                           onChange={e => setState({ user: {...state.user, username: e?.target?.value} })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                        {t('profile:name')}
                    </span>
                    <input className={inputClass}
                           value={name}
                           onChange={e => setState({ user: {...state.user, name: e?.target?.value} })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Nami ID</span>
                    <input className={inputClass + (state.isEditable ? 'opacity-80 cursor-not-allowed' : '')}
                           value={state.user?.namiId}
                           readOnly={true}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Email</span>
                    <div className="flex items-center pr-3 xl:pr-0">
                        <input className={state.isEditable ? 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right py-1 pr-2 xl:text-right xl:ml-4'
                        : 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right pr-2 xl:text-right xl:ml-4'}
                               value={state.user?.email}
                               readOnly={true}/>
                        <SvgCheckSuccess/>
                    </div>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                        {t('profile:phone_number')}
                    </span>
                    <input className={inputClass}
                           value={phone}
                           onChange={e => setState({ user: {...state.user, phone: e?.target?.value} })}
                           readOnly={!state.isEditable}/>
                </div>
                {/*<div className="w-full lg:flex lg:justify-end lg:pr-3 xl:justify-start">*/}
                {/*    <div className="mt-11 bg-dominant rounded-md py-2.5 cursor-pointer font-medium text-sm text-center text-white hover:opacity-80*/}
                {/*                    lg:min-w-[130px] lg:w-[130px]"*/}
                {/*         onClick={() => state.isEditable ? !state.savingInfo && onSave({ name, username, phone }) : onEdit()}>*/}
                {/*        {state.savingInfo ? <PulseLoader size={3} color="#FFFF"/>*/}
                {/*            : state.isEditable ? t('common:save') : t('common:edit')}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        )
    }, [state.isEditable, state.savingInfo, state.user, width])

    const renderFee = useCallback(() => {
        let seeFeeStructure, useNamiForBonus
        const nextAssetFee = state.assetFee?.feeCurrency === 1 ? 0 : 1

        if (language === LANGUAGE_TAG.VI) {
            seeFeeStructure = 'Xem biểu phí'
            useNamiForBonus = <>
                Dùng NAMI để được giảm phí <span className="ml-1 text-dominant font-medium whitespace-nowrap">(chiết khấu 25%)</span>
            </>
        } else {
            seeFeeStructure = 'See fee structures'
            useNamiForBonus = <>
                Using NAMI to pay for fees <span className="ml-1 text-dominant font-medium whitespace-nowrap">(25% discount)</span>
            </>
        }

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                { width: `calc(80% / 3)` } : undefined}
                 className="mt-12 xl:max-w-[300px] text-sm w-full mt-10 lg:w-1/2 lg:pr-5 xl:mt-0 xl:p-0">
                <div>
                    <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                        {t('fee-structure:your_fee_level')} <span className="ml-1 text-dominant">{state.loadingLevel ? <Skeletor width={45}/> : <>VIP {state.level || '0'}</>}</span>
                    </div>
                    <div className="">
                        <div className="flex items-center justify-between xl:justify-start mt-4">
                            <span className="font-medium text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[40px]">
                                Maker
                            </span>
                            <span className="font-bold text-txtPrimary dark:text-txtPrimary-dark text-[18px] lg:text-[20px] 2xl:text-[26px] xl:ml-8">
                                0.075%
                            </span>
                        </div>
                        <div className="flex items-center justify-between xl:justify-start mt-4">
                            <span className="font-medium text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[40px]">
                                Trader
                            </span>
                            <span className="font-bold text-txtPrimary dark:text-txtPrimary-dark text-[18px] lg:text-[20px] 2xl:text-[26px] xl:ml-8">
                                0.075%
                            </span>
                        </div>
                        <div className="flex items-center mt-4">
                            <Switcher active={!!state.assetFee?.feeCurrency}
                                      loading={state.loadingAssetFee}
                                      onChange={() => !state.loadingAssetFee && onUseAssetAsFee('set', nextAssetFee)}/>
                            <span className="text-sm ml-3 sm:flex sm:whitespace-nowrap">
                                {useNamiForBonus}
                            </span>
                        </div>
                    </div>
                </div>
                <Link href={PATHS.FEE_STRUCTURES.DEFAULT} prefetch={false}>
                    <a className="inline-block w-auto mt-4 lg:mt-10 2xl:mt-12 font-medium text-sm text-dominant cursor-pointer hover:!underline">
                        {seeFeeStructure}
                    </a>
                </Link>
            </div>
        )
    }, [state.useNami, state.level, state.loadingLevel, state.assetFee, state.loadingAssetFee, width])

    const renderJourney = useCallback(() => {
        const _level = state.level || 0
        let toUpgrade, namiBalanceLabel
        if (language === LANGUAGE_TAG.VI) {
            toUpgrade = 'Để trở thành'
            namiBalanceLabel = 'Số dư NAMI'
        } else {
            toUpgrade = 'To upgrade to'
            namiBalanceLabel = 'Your NAMI balance'
        }

        const nextLevel = FEE_TABLE.find(e => e?.level === _level + 1)
        const currentPercent = namiWallets?.value ? namiWallets.value * 100 / nextLevel?.nami_holding : '--'

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                { width: `calc(80% / 3)` } : undefined}
                 className="mt-12 xl:max-w-[306px] text-sm w-full mt-10 lg:w-1/2 lg:pl-5 xl:mt-0 xl:pl-5">
                <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                    {toUpgrade} <span className="ml-1 text-dominant">{state.loadingLevel ? <Skeletor width={45}/> : <>VIP {_level + 1}</>}</span>
                </div>
                {/*<div className="mt-4">*/}
                {/*    <div className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">1. 30d trade volume (BTC)</div>*/}
                {/*    <div className="my-2.5 relative w-full h-[10px] rounded-xl bg-teal-lightTeal dark:bg-teal-opacity overflow-hidden">*/}
                {/*        <div style={{ width: '20%' }}*/}
                {/*             className="absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in"/>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-between">*/}
                {/*        <span className="text-xs font-medium">*/}
                {/*            <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">VIP {_level}</span>*/}
                {/*            <span>0.0215245781 BTC / 0.04%</span>*/}
                {/*        </span>*/}
                {/*        <span className="text-xs font-medium">*/}
                {/*            <span className="">*/}
                {/*                50.00 BTC*/}
                {/*            </span>*/}
                {/*            <span className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">VIP {_level + 1}</span>*/}
                {/*        </span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="mt-4">
                    <div className="flex items-center justify-between font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {namiBalanceLabel}
                        <Link href={PATHS.EXCHANGE.SWAP.getSwapPair({ fromAsset: 'VNDC', toAsset: ROOT_TOKEN })}>
                            <a className="text-dominant hover:!underline">{t('common:buy')} NAMI</a>
                        </Link>
                    </div>
                    <div className="my-2.5 relative w-full h-[6px] xl:h-[6px] rounded-xl bg-teal-lightTeal dark:bg-teal-opacity overflow-hidden">
                        <div style={{ width: `${currentPercent}%` }}
                             className="absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in"/>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-medium">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">VIP {_level}</span>
                            <span>
                                {formatNumber(namiWallets?.value) || '--'} {ROOT_TOKEN} / {formatNumber(currentPercent)}%
                            </span>
                        </span>
                        <span className="text-xs font-medium">
                            <span className="">
                                {formatNumber(nextLevel?.nami_holding, 0)} {ROOT_TOKEN}
                            </span>
                            <span className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">VIP {_level + 1}</span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }, [state.level, state.loadingLevel, width, language, namiWallets])

    const renderActivities = useCallback(() => {
        if (state.loadingActivity) {
            const skeleton = []
            for (let i = 0; i < 5; ++i) {
                skeleton.push(
                    <div className="flex justify-between text-sm font-medium mb-5">
                        <div>
                            <div className="device font-bold"><Skeletor width={100}/></div>
                            <div className="location mt-2"><Skeletor width={65}/></div>
                        </div>
                        <div className="">
                            <div className="ip-address text-right"><Skeletor width={75}/></div>
                            <div className="date-time mt-2 flex justify-end">
                                <Skeletor width={65}/>
                            </div>
                        </div>
                    </div>
                )
            }
            return skeleton
        }

        if (!state.activitiesLog) return null

        return state.activitiesLog?.map(log => {
            let _os
            if (log?.os?.name && !log?.os?.version) {
                _os = `(${log?.os?.name})`
            } else if (!log?.os?.name && log?.os?.version) {
                _os = `(${log?.os?.version})`
            } else if (log?.os?.name && log?.os?.version) {
                _os = `(${log?.os?.name} ${log?.os?.version})`
            }

            return (
                <div key={log?._id} className="flex justify-between text-sm font-medium mb-5">
                    <div>
                        <div className="device font-bold">{log?.browser?.name ||t('common:unknown')} {log?.browser?.version && `(${log?.browser?.version})`}</div>
                        <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                            {_os}
                        </div>
                    </div>
                    <div className="">
                        {log?.ip && <Tooltip id={`ip_address_${log?._id}`}>
                            {log?.ip}
                        </Tooltip>}
                        <div data-tip="" data-for={`ip_address_${log?._id}`}
                             className="ip-address max-w-[130px] truncate text-right whitespace-nowrap cursor-pointer">
                            {log?.ip || EMPTY_VALUE}
                        </div>
                        <div className="date-time mt-2 text-right text-txtSecondary dark:text-txtSecondary-dark">
                            {formatTime(log?.created_at, 'dd-MM-yyyy')}
                            <span className="ml-4">{formatTime(log?.created_at, 'HH:mm')}</span>
                        </div>
                    </div>
                </div>
            )
        })

    }, [state.loadingActivity, state.activitiesLog])

    const renderAnnoucements = useCallback(() => {
        if (state.loadingAnnouncements) {
            const skeleton = []
            for (let i = 0; i < 5; ++i) {
                skeleton.push(
                    <div className="text-sm font-medium mb-5">
                        <div className="device font-bold">
                            <Skeletor width={150}/>
                        </div>
                        <div className="location mt-2">
                            <Skeletor width={100}/>
                        </div>
                    </div>
                )
            }
            return skeleton
        }

        if (!state.announcements) return null

        return orderBy(state.announcements, [(e) => Date.parse(e?.post_modified)], ['desc'])?.map(a => (
            <div key={a?.ID} className="block text-sm font-medium mb-5">
                <a className="device font-bold hover:text-dominant hover:!underline"
                   href={a?.guid}
                   target="_blank">
                    {a?.post_title}
                </a>

                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                    {formatTime(a?.post_date, 'dd-MM-yyyy HH:mm')}
                </div>
            </div>
        ))
    }, [state.announcements, state.loadingAnnouncements])

    useEffect(() => {
        onUseAssetAsFee('get')
        getLoginLogs()
        getLevel()
    }, [])

    useEffect(() => {
        getAnnouncements(language)
    }, [language])

    useEffect(() => {
        user && setState({ user: {
                name: user?.name || '--',
                username: user?.username || '--',
                phone: user?.phone || '--',
                email: user?.email || '--',
                namiId: user?.code || '--'
            }})
    }, [user])

    useEffect(() => {
        log.d('State => ', state)
    }, [state])

    if (!user) {
        return <NeedLogin addClass="h-[380px] flex justify-center items-center"/>
    }

    return (
        <div className="pb-20 lg:pb-24 2xl:pb-32">
            <div className="font-bold leading-[40px] text-[26px] mb-6">
                {t('navbar:menu.user.profile')}
            </div>
            <MCard addClass="lg:flex lg:flex-wrap lg:justify-between px-7 py-8 lg:p-10 xl:px-7 xl:py-8 w-full drop-shadow-onlyLight border border-transparent dark:drop-shadow-none dark:border-divider-dark">
                {renderUserPersona()}
                {renderUserInfo()}
                {renderFee()}
                {renderJourney()}
            </MCard>

            <div className="mt-10 flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 lg:pr-2.5">
                    <div className="flex justify-between items-center">
                        <div className="t-common">{t('profile:activity')}</div>
                        <span className="flex items-center font-medium text-red hover:!underline cursor-pointer">
                            {t('profile:disable_account')} <ChevronRight className="ml-2" size={20}/>
                        </span>
                    </div>
                    <MCard style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                           addClass="mt-5 p-4 sm:p-6 lg:p-7 min-h-[356px] dark:border dark:border-divider-dark !overflow-hidden">
                           <div className="max-h-[300px] pr-4 overflow-y-auto">
                               {renderActivities()}
                           </div>
                    </MCard>
                </div>
                <div className="w-full mt-8 lg:mt-0 lg:w-1/2 lg:pl-2.5">
                    <div className="t-common">
                        {t('profile:announcements')}
                    </div>
                    <MCard style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                           addClass="max-h-[400px] min-h-[356px] overflow-y-auto mt-5 p-4 sm:p-6 lg:p-7 dark:border dark:border-divider-dark !overflow-hidden">
                        <div className="max-h-[300px] overflow-y-auto">
                            {renderAnnoucements()}
                        </div>
                    </MCard>
                </div>
            </div>
        </div>
    )
}


export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure'])
    }
})


export default withTabLayout({ routes: TAB_ROUTES.ACCOUNT })(AccountProfile)
