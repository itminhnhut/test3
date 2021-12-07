import { useCallback, useEffect, useRef, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { PulseLoader } from 'react-spinners'
import { BREAK_POINTS, EMPTY_VALUE } from 'constants/constants'
import { ChevronRight } from 'react-feather'
import { API_GET_LOGIN_LOG, API_GET_VIP } from 'redux/actions/apis'
import { TAB_ROUTES } from 'components/common/layouts/withTabLayout'
import { ApiStatus } from 'redux/actions/const'
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
import Switcher from 'components/common/Switcher'
import Axios from 'axios'
import NeedLogin from 'components/common/NeedLogin'
import { formatTime } from 'redux/actions/utils'

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

    // ... Add new state
}

const AccountProfile = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    const firstInputRef = useRef()

    // Rdx
    const user = useSelector(state => state.auth?.user)

    // Use Hooks
    const { t, i18n: { language } } = useTranslation(['navbar', 'common'])
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()

    // Helper
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

    const getAnnouncements = async (lang = 'vi') => {
        !state.announcements &&
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

    const onEdit = () => {
        setState({ isEditable: true })
        firstInputRef.current?.focus()
    }

    const onSave = (payload) => {
        setState({ savingInfo: true })
        setState({ user: { ...state.user, ...payload } })
        setTimeout(() => {
            setState({ savingInfo: false, isEditable: false })
        }, 1500)
    }

    // Render Handler
    const renderUserPersona = useCallback(() => {
        if (!user) return null

        return (
            <div className="flex flex-col items-center w-full lg:w-2/5 xl:w-[15%]">
                <div className="w-[152px] h-[152px] rounded-full overflow-hidden bg-gray-4 dark:bg-darkBlue-5">
                    <img src={user?.avatar} alt="Nami.Exchange" width="152" height="152"/>
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
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Username</span>
                    <input className={inputClass}
                           value={username}
                           ref={firstInputRef}
                           onChange={e => setState({ user: {...state.user, username: e?.target?.value} })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Fullname</span>
                    <input className={inputClass}
                           value={name}
                           onChange={e => setState({ user: {...state.user, name: e?.target?.value} })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Nami ID</span>
                    <input className={state.isEditable ? 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right py-1 pr-2 xl:text-right xl:ml-4'
                        : 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right pr-2 xl:text-right xl:ml-4'}
                           value={state.user?.code}
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
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Phone Number</span>
                    <input className={inputClass}
                           value={phone}
                           onChange={e => setState({ user: {...state.user, phone: e?.target?.value} })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="w-full lg:flex lg:justify-end lg:pr-3 xl:justify-start">
                    <div className="mt-11 bg-dominant rounded-md py-2.5 cursor-pointer font-medium text-sm text-center text-white hover:opacity-80
                                    lg:min-w-[130px] lg:w-[130px]"
                         onClick={() => state.isEditable ? !state.savingInfo && onSave({ name, username, phone }) : onEdit()}>
                        {state.savingInfo ? <PulseLoader size={3} color="#FFFF"/>
                            : state.isEditable ? t('common:save') : t('common:edit')}
                    </div>
                </div>
            </div>
        )
    }, [state.isEditable, state.savingInfo, state.user, width])

    const renderFee = useCallback(() => {
        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                { width: `calc(80% / 3)` } : undefined}
                 className="mt-12 xl:max-w-[300px] text-sm w-full mt-10 lg:w-1/2 lg:pr-5 xl:mt-0 xl:p-0 xl:flex xl:flex-col xl:justify-between">
                <div>
                    <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                        Your trading fee: <span className="ml-1">{state.loadingLevel ? <Skeletor width={45}/> : <>VIP {state.level || '0'}</>}</span>
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
                            <Switcher active={state.useNami} onChange={() => setState({ useNami: !state.useNami })}/>
                            <span className="text-sm ml-3">
                            Using NAMI to pay for fees <span className="ml-1 text-dominant font-medium whitespace-nowrap">(25% discount)</span>
                        </span>
                        </div>
                    </div>
                </div>
                <Link href={PATHS.FEE_STRUCTURES.DEFAULT} prefetch={false}>
                    <a className="inline-block w-auto mt-6 lg:mt-10 2xl:mt-12 font-medium text-sm text-dominant cursor-pointer hover:!underline">
                        See fee structures
                    </a>
                </Link>
            </div>
        )
    }, [state.useNami, state.level, state.loadingLevel, width])

    const renderJourney = useCallback(() => {
        const _level = state.level || 0

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                { width: `calc(80% / 3)` } : undefined}
                 className="mt-12 xl:max-w-[306px] text-sm w-full mt-10 lg:w-1/2 lg:pl-5 xl:mt-0 xl:pl-5">
                <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                    To upgrade to <span className="ml-1 text-dominant">{state.loadingLevel ? <Skeletor width={45}/> : <>VIP {_level + 1}</>}</span>
                </div>
                <div className="mt-4">
                    <div className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">1. 30d trade volume (BTC)</div>
                    <div className="my-2.5 relative w-full h-[10px] rounded-xl bg-teal-lightTeal dark:bg-teal-opacity overflow-hidden">
                        <div style={{ width: '20%' }}
                             className="absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in"/>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-medium">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">VIP {_level}</span>
                            <span>0.0215245781 BTC / 0.04%</span>
                        </span>
                        <span className="text-xs font-medium">
                            <span className="">
                                50.00 BTC
                            </span>
                            <span className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">VIP {_level + 1}</span>
                        </span>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        2. Your NAMI balance
                        <Link href="/">
                            <a className="text-dominant hover:!underline">Buy NAMI</a>
                        </Link>
                    </div>
                    <div className="my-2.5 relative w-full h-[10px] rounded-xl bg-teal-lightTeal dark:bg-teal-opacity overflow-hidden">
                        <div style={{ width: '20%' }}
                             className="absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in"/>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-medium">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">VIP {_level}</span>
                            <span>0.000000 NAMI / 0.00%</span>
                        </span>
                        <span className="text-xs font-medium">
                            <span className="">
                                50.00 NAMI
                            </span>
                            <span className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">VIP {_level + 1}</span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }, [state.level, state.loadingLevel, width])

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
                        <div className="device font-bold">{log?.browser?.name || EMPTY_VALUE} {log?.browser?.version && `(${log?.browser?.version})`}</div>
                        <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                            {_os}
                        </div>
                    </div>
                    <div className="">
                        <div className="ip-address max-w-[130px] truncate text-right whitespace-nowrap">{log?.ip || EMPTY_VALUE}</div>
                        <div className="date-time mt-2 text-right text-txtSecondary dark:text-txtSecondary-dark">
                            {formatTime(log?.created_at, 'dd-MM-yyyy')}
                            <span className="ml-4">{formatTime(log?.created_at, 'HH:mm')}</span>
                        </div>
                    </div>
                </div>
            )
        })

    }, [state.loadingActivity, state.activitiesLog])

    useEffect(() => {
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
                        <div className="t-common">
                            Activity
                        </div>
                        <span className="flex items-center font-medium text-dominant hover:!underline cursor-pointer">
                            Disable account <ChevronRight className="ml-2" size={20}/>
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
                        Announcements
                    </div>
                    <MCard style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                           addClass="max-h-[400px] min-h-[356px] overflow-y-auto mt-5 p-4 sm:p-6 lg:p-7 dark:border dark:border-divider-dark !overflow-hidden">
                        <div className="max-h-[300px] overflow-y-auto">
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                            <div className="text-sm font-medium mb-5">
                                <div className="device font-bold">
                                    Binance Will Support the Cortex (CTXC) Network Upgrade & Hard Fork
                                </div>
                                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    Ho Chi Minh, Vietnam
                                </div>
                            </div>
                        </div>
                    </MCard>
                </div>
            </div>
        </div>
    )
}


export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar'])
    }
})


export default withTabLayout({ routes: TAB_ROUTES.ACCOUNT })(AccountProfile)
