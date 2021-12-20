import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import RewardItem from 'components/screens/Account/RewardItem'
import useApp from 'hooks/useApp'
import SegmentTabs from 'components/common/SegmentTabs'

import _reward_data, { REWARD_STATUS, REWARD_TYPE } from 'components/screens/Account/_reward_data'
import Empty from 'components/common/Empty'
import ReModal, { REMODAL_BUTTON_GROUP, REMODAL_POSITION } from 'components/common/ReModal'
import useInView from 'react-cool-inview'
import { PATHS } from 'constants/paths'

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
            onChange: ({ observe, unobserve }) => {
                unobserve() // To stop observing the current target element
                observe() // To re-start observing the current target element
            },
            onEnter: () => setState({ showFixedAppSegment: true }),
            onLeave: () => setState({ showFixedAppSegment: false })
        })

    // Helper
    const getRewardData = () => {
        setState({ loadingReward: true })
        const rewards = _reward_data
        setState({ rewards })
        setTimeout(() => setState({ loadingReward: false }), 1000)
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
            { key: 2, title: `Trading${counter?.trading ? ` (${counter.trading})` : ''}` }
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
    const renderSegmentTabs = () => {
        return (
            <SegmentTabs active={state.tabIndex}
                         onChange={(tabIndex) => setState({ tabIndex })}
                         tabSeries={tabSeries}
            />
        )
    }

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
                key={reward?.id}
                data={reward}
                loading={state.loadingReward}
                active={state?.rewardExpand?.[reward?.id]}
                onToggleReward={(rewardId, status) => onToggleReward(rewardId, status)}
                showGuide={showGuide}
            />
        ))
    }, [state.tabIndex, state.rewards, state.loadingReward, state.rewardExpand])

    const renderPopup = useCallback(() => {
        if (!state.popupMsg?.msg) return null

        return (
            <ReModal
                useOverlay
                useButtonGroup={REMODAL_BUTTON_GROUP.SINGLE_CONFIRM}
                position={REMODAL_POSITION.CENTER}
                isVisible={!!state.popupMsg?.msg}
                // title={state.popupMsg?.title}
                onBackdropCb={closePopup}
                onPositiveCb={closePopup}
                className="py-5"
                buttonGroupWrapper="max-w-[150px] mx-auto"
            >
                <div className="font-bold mb-3.5 text-center lg:text-[18px]">
                    {state.popupMsg?.title}
                </div>
                <div className="mt-3 mb-4 lg:mb-5 font-medium text-sm text-center">
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
            setState({ rewardExpand: { [state.rewards?.[0]?.id]: true } })
        }
    }, [state.rewards])

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
