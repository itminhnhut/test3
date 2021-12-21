import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import RewardItem from 'components/screens/Account/RewardItem'
import useApp from 'hooks/useApp'
import SegmentTabs from 'components/common/SegmentTabs'

import { REWARD_STATUS, REWARD_TYPE } from 'components/screens/Account/_reward_data'
import Empty from 'components/common/Empty'
import ReModal, { REMODAL_BUTTON_GROUP, REMODAL_POSITION } from 'components/common/ReModal'
import useInView from 'react-cool-inview'
import { PATHS } from 'constants/paths'
import Axios from 'axios'
import { API_CLAIM_MISSION_REWARD, API_GET_MISSION } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import Types from 'components/screens/Account/types'
import { formatNumber, getS3Url } from 'redux/actions/utils'
import { LANGUAGE_TAG } from 'hooks/useLanguage'

export const REWARD_ROW_ID_KEY = 'reward_item_id_' // for identify reward will scrollTo after init
const REWARD_ID_QUERY_KEY = 'reward_id' // for query url
const REWARD_TYPE_QUERY_KEY = 'reward' // for query url

const REWARD_TYPE_QUERY_VALUE = {
    ALL: 'all',
    PROMOTION: 'promotion',
    TRADING: 'trading'
}

const REWARD_TAB = {
    ALL: 0,
    PROMOTION: 1,
    TRADING: 2
}

const INITIAL_STATE = {
    tabIndex: REWARD_TAB.ALL,
    rewards: [],
    loadingReward: false,
    rewardExpand: {},
    popupMsg: null,
    showFixedAppSegment: false,
    isQueryDone: false,
    claim: null,
    claiming: false,
}

const RewardCenter = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Use Hooks
    const [currentTheme] = useDarkMode()
    const { t } = useTranslation()
    const router = useRouter()
    const isApp = useApp()

    const { observe } = useInView(
        {
            threshold: 0.25,
            onEnter: () => setState({ showFixedAppSegment: true }),
            onLeave: () => setState({ showFixedAppSegment: false })
        })

    // Helper
    const onClaim = async (id, payload) => {
        setState({ claiming: true })

        try {
            const { data } = await Axios.post(API_CLAIM_MISSION_REWARD, { id })
            if (data?.status === ApiStatus.SUCCESS) {
                let msg = '--'
                const { reward, assetConfig } = payload

                if (language === LANGUAGE_TAG.VI) {
                    msg = <>
                        Chúc mừng, bạn đã nhận thưởng thành công
                        <span className="text-dominant">{formatNumber(reward?.value, assetConfig?.assetDigit)} {assetConfig?.assetName}</span>
                    </>
                } else {
                    msg = <>
                        Congratulation, you have successfully received
                        <span className="text-dominant">{formatNumber(reward?.value, assetConfig?.assetDigit)} {assetConfig?.assetName}</span>
                    </>
                }
                const popupMsg = {
                    type: 'success',
                    msg
                }
                // re-fetch reward data
                await getRewardData()
                setState({ claim: data?.data, popupMsg })
            } else {
                switch (data?.status) {
                    case Types.CLAIM_RESULT.INVALID_MISSION:
                    case Types.CLAIM_RESULT.INVALID_USER:
                    case Types.CLAIM_RESULT.INVALID_TIME:
                        setState({popupMsg: { type: 'error', msg: t(`reward-center:reward_error.${data?.status}`) }})
                        break
                    case Types.CLAIM_RESULT.INVALID_CLAIM_STATUS:
                    case Types.CLAIM_RESULT.INVALID_STATUS:
                    default:
                        setState({popupMsg: { type: 'error', msg: t(`reward-center:reward_error.${data?.status}`) }})
                        break
                }
            }
        } catch (e) {
            console.log(`Can't claim reward `, e)
        } finally {
            setState({ claiming: false })
        }
    }

    const getRewardData = async () => {
        !state.loadingReward && setState({ loadingReward: true })
        try {
            const { data } = await Axios.get(API_GET_MISSION)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ rewards: data.data })
            }
        } catch (e) {
            console.log(`Can't get mission data `, e)
        } finally {
            setState({ loadingReward: false })
        }
    }

    const closePopup = () => setState({ popupMsg: null })

    const showGuide = (event, guide) => {
        event?.stopPropagation()
        setState({ popupMsg: { title: t('reward-center:notice_title'), msg: guide } })
    }

    const scrollToReward = (elementId) => {
        const rewardElement = document.getElementById(elementId)
        rewardElement && rewardElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }

    // Memmoized
    const rewardAppStyles = useMemo(() => {
        let _className
        let _styles

        if (isApp) {
            _className = 'mt-4 h-full rounded-tl-[20px] rounded-tr-[20px] dark:bg-bgContainer-dark -mx-4 px-4 py-6 '

            if (currentTheme === THEME_MODE.LIGHT) {
                _styles = {
                    boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)',
                    backgroundColor: '#FCFCFC'
                }
            } else {
                _styles = {
                    // boxShadow: '0px -4px 30px rgba(245, 245, 245, 0.18)'
                }
            }
        } else {
            _className = ''
            _styles = {}
        }

        return {
            className: _className,
            styles: _styles
        }
    }, [isApp, currentTheme])

    const rewardListWrapperStyles = useMemo(() => {
        let style = {}

        if (currentTheme === THEME_MODE.LIGHT) {
            style = { boxShadow: '0px 4.09659px 13.4602px rgba(0, 0, 0, 0.05)' }
        } else {
            // style = { boxShadow: '0px 4.09659px 13.4602px rgba(245, 245, 245, 0.05)' }
        }

        return style
    }, [currentTheme])

    // Utilities
    const tabSeries = useMemo(() => {
        const counter = {}

        if (state.rewards?.length) {
            const rewardFiltered = state.rewards?.filter(o => o?.status !== REWARD_STATUS.NOT_AVAILABLE)
            counter.all = rewardFiltered?.length
            counter.promotion = rewardFiltered?.filter(o => o?.type === REWARD_TYPE.PROMOTION)?.length
            counter.trading = rewardFiltered?.filter(o => o?.type === REWARD_TYPE.TRADING)?.length
        }

        return [
            { key: 0, title: `${t('common:all')}${counter?.all ? ` (${counter.all})` : ''}` },
            { key: 1, title: `Promotion${counter?.promotion ? ` (${counter.promotion})` : ''}` },
            // { key: 2, title: `Trading${counter?.trading ? ` (${counter.trading})` : ''}` }
        ]
    }, [state.rewards])

    const onToggleReward = (rewardId, status) => {
        setState({ rewardExpand: { [rewardId]: status } })
        if (!state.isQueryDone) {
            router?.push(
                {
                    pathname: PATHS.ACCOUNT.REWARD_CENTER,
                    query: isApp ? { source: 'app' } : undefined
                },
                undefined,
                {shallow: true}
            )
            setState({ isQueryDone: true })
        }
    }

    // Render Handler
    const renderSegmentTabs = useCallback(() => {
        return (
            <SegmentTabs active={state.tabIndex}
                         onChange={(tabIndex) => setState({ tabIndex })}
                         tabSeries={tabSeries}
            />
        )
    }, [state.tabIndex, tabSeries, observe])

    const renderReward = useCallback(() => {
        if (state.loadingReward) {
            return (
                <>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                </>
            )
        }

        let rewardType = ''
        if (state.tabIndex === 1) rewardType = REWARD_TYPE.PROMOTION
        if (state.tabIndex === 2) rewardType = REWARD_TYPE.TRADING

        const data = state.rewards?.filter(o => o?.type?.includes(rewardType))

        if (!data?.length) {
            return (
                <div className="min-h-[400px] xl:min-h-[520px] 2xl:min-h-[550px] h-full flex items-center justify-center dark:bg-darkBlue-2">
                    <Empty message={t('reward-center:no_promo')}
                           messageStyle="text-xs sm:text-sm"
                    />
                </div>
            )
        }

        return data?.map(reward => (
            <RewardItem
                key={reward?._id}
                data={reward}
                loading={state.loadingReward}
                active={state?.rewardExpand?.[reward?._id]}
                onToggleReward={(rewardId, status) => onToggleReward(rewardId, status)}
                showGuide={showGuide}

                claim={state.claim}
                claiming={state.claiming}
                onClaim={onClaim}
            />
        ))
    }, [state.tabIndex, state.rewards, state.loadingReward, state.rewardExpand, state.claim, state.claiming])

    const renderPopup = useCallback(() => {
        return (
            <ReModal
                useOverlay={!isApp}
                useButtonGroup={state.popupMsg?.type === 'error' ? REMODAL_BUTTON_GROUP.ALERT : REMODAL_BUTTON_GROUP.SINGLE_CONFIRM}
                position={REMODAL_POSITION.CENTER}
                isVisible={!!state.popupMsg?.msg}
                title={state.popupMsg?.title}
                onBackdropCb={closePopup}
                onNegativeCb={closePopup}
                onPositiveCb={closePopup}
                className="py-5"
                buttonGroupWrapper="max-w-[150px] mx-auto"
            >
                {state.popupMsg?.type === 'error' && <div className="w-full">
                    <img className="m-auto w-[45px] h-[45px]" src={getS3Url('/images/icon/errors.png')} alt="ERRORS" />
                </div>}
                {state.popupMsg?.type === 'success' && <div className="w-full">
                    <img className="m-auto w-[45px] h-[45px]" src={getS3Url('/images/icon/success.png')} alt="ERRORS" />
                </div>}
                <div className="mt-4 mb-4 lg:mb-5 font-medium text-sm text-center">
                    {state.popupMsg?.msg}
                </div>
            </ReModal>
        )
    }, [state.popupMsg])

    const renderFixedSegmentTabs = useCallback(() => {
        if (!isApp) return null

        return (
            <div className={state.showFixedAppSegment ?
                'p-4 w-full bg-bgContainer dark:bg-bgContainer-dark rounded-xl drop-shadow-onlyLight fixed z-50 top-0 left-0 !whitespace-nowrap opacity-0 transition-all ease-in-out duration-200 invisible'
                : 'p-4 w-full bg-bgContainer dark:bg-bgContainer-dark rounded-xl drop-shadow-onlyLight fixed z-50 top-0 left-0 !whitespace-nowrap transition-all ease-in-out duration-200 !visible !opacity-100'}>
                {renderSegmentTabs()}
            </div>
        )
    }, [state.showFixedAppSegment, isApp, renderSegmentTabs])

    useEffect(() => {
        getRewardData()
    }, [])

    useEffect(() => {
        const rewardQueryId = router?.query?.[REWARD_ID_QUERY_KEY]
        const rewardType = router?.query?.[REWARD_TYPE_QUERY_KEY]

        if (!state.loadingReward) {
            rewardQueryId && setState({ rewardExpand: { [rewardQueryId]: true } })
            if (rewardType) {
                switch (rewardType) {
                    case REWARD_TYPE_QUERY_VALUE.PROMOTION:
                        setState({ tabIndex: REWARD_TAB.PROMOTION })
                        break
                    case REWARD_TYPE_QUERY_VALUE.TRADING:
                        setState({ tabIndex: REWARD_TAB.PROMOTION })
                        break
                    case REWARD_TYPE_QUERY_VALUE.ALL:
                    default:
                        setState({ tabIndex: REWARD_TAB.ALL })
                        break
                }
            }
        }
    }, [router, state.loadingReward])

    useEffect(() => {
        const rewardQueryId = router?.query?.[REWARD_ID_QUERY_KEY]
        if (rewardQueryId && !state.isQueryDone && Object.keys(state.rewardExpand)?.length) {
            setTimeout(() => scrollToReward(REWARD_ROW_ID_KEY + rewardQueryId), 250)
        }
    }, [router, state.rewardExpand, state.isQueryDone])

    useEffect(() => {
        if (state.rewards?.length < 3) {
            setState({ rewardExpand: { [state.rewards?.[0]?._id]: true } })
        }
    }, [state.rewards])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: State => ', state)
    // }, [state])

    return (
        <>
            {renderFixedSegmentTabs()}
            <div className="h-full">
                {!isApp && renderSegmentTabs()}
                <div className="mt-8 t-common select-none">
                    {isApp ? t('reward-center:title') : t('reward-center:promotion')}
                </div>
                <div style={rewardAppStyles?.styles} className={rewardAppStyles?.className}>
                    {isApp && <div ref={observe}>{renderSegmentTabs()}</div>}
                    <div id="reward-center"
                         className="mt-6 overflow-hidden rounded-lg dark:border dark:border-divider-dark"
                         style={rewardListWrapperStyles}>
                        {renderReward()}
                    </div>
                </div>
            </div>
            {renderPopup()}
        </>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'reward-center'])
    }
})

export default withTabLayout(
    {
        routes: TAB_ROUTES.ACCOUNT,
        hideInApp: true
    })
(RewardCenter)
