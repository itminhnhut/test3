import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import RewardItem from 'components/screens/Account/RewardItem'
import useApp from 'hooks/useApp'
import SegmentTabs from 'components/common/SegmentTabs'

import _reward_data, { REWARD_STATUS, REWARD_TYPE } from 'components/screens/Account/_reward_data'
import Empty from 'components/common/Empty'
import ReModal, { REMODAL_BUTTON_GROUP, REMODAL_POSITION } from 'components/common/ReModal'

const INITIAL_STATE = {
    tabIndex: 0,
    rewards: [],
    loadingReward: false,
    rewardExpand: {},
    popupMsg: null

}

const REWARD_INITIAL_QUERY_KEY = 'reward_id'

export const REWARD_ID_KEY = 'reward_item_id_'

const RewardCenter = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Use Hooks
    const [currentTheme] = useDarkMode()
    const { t } = useTranslation()
    const router = useRouter()
    const isApp = useApp()

    useScrollPosition(({ currPos }) => {
        // console.log('namidev-DEBUG: Current Y ', currPos.y)
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

    const onToggleReward = (rewardId, status) => setState({ rewardExpand: { [rewardId]: status } })

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
                <div className="min-h-[400px] h-full flex items-center justify-center">
                    <Empty message="Không có ưu đãi cho danh mục này"
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

    useEffect(() => {
        getRewardData()
    }, [])

    useEffect(() => {
        const rewardQueryId = router?.query?.[REWARD_INITIAL_QUERY_KEY]
        if (!state.loadingReward && rewardQueryId) {
            setState({ rewardExpand: { [rewardQueryId]: true } })
        }
    }, [router, state.loadingReward])

    useEffect(() => {
        console.log('namidev-DEBUG: Watching State => ', state)
    }, [state])


    return (
        <>
            <div className="h-full">
                {!isApp && renderSegmentTabs()}
                <div className="mt-8 t-common select-none">
                    {isApp ? t('reward-center:title') : t('reward-center:promotion')}
                </div>
                <div style={rewardAppStyles?.styles} className={rewardAppStyles?.className}>
                    {isApp && renderSegmentTabs()}
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
