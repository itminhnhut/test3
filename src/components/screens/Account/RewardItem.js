import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { useSelector } from 'react-redux'
import { ChevronRight } from 'react-feather'
import { REWARD_STATUS } from 'components/screens/Account/_reward_data'
import { BREAK_POINTS } from 'constants/constants'
import { REWARD_ID_KEY } from 'pages/account/reward-center'

import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import RewardList from 'components/screens/Account/RewardList'
import AssetName from 'components/wallet/AssetName'
import Skeletor from 'components/common/Skeletor'

const RewardItem = memo(({ data, loading, active, onToggleReward }) => {
    // Rdx
    const assetConfig = useSelector(state => state.utils.assetConfig?.find(o => o?.id === data?.total_reward?.assetId))

    // Use Hooks
    const { i18n: { language } } = useTranslation()
    const { width } = useWindowSize()
    const [theme, ] = useDarkMode()

    // Utilities
    const rewardRowStyles = useMemo(() => {

        const originClass = 'pl-4 py-3 pr-6 flex items-center justify-between cursor-pointer select-none hover:bg-teal-lightTeal '
        let className = ''

        if (data?.status === REWARD_STATUS.NOT_AVAILABLE) {
            className = originClass + 'cursor-not-allowed opacity-50 hover:bg-transparent'
        } else {
            if (active) {
                className = originClass + ' bg-teal-lightTeal'
            } else {
                className = originClass
            }
        }

        return className
    }, [data?.status, active])

    // Render Handler
    const renderRewardList = useCallback(() => {
        const isActive = active && data?.status !== REWARD_STATUS.NOT_AVAILABLE

        const originClass = 'w-full invisible max-h-[0px] transition-all duration-200 ease-in-out pl-4 sm:pl-8 xl:pl-12 '
        let className = ''

        if (isActive) {
            className = originClass + '!visible !max-h-[800px] pb-6'
        } else {
            className = originClass
        }

        return (
            <div className={className}>
                <div style={
                    theme === THEME_MODE.LIGHT ?
                        { boxShadow: '0px 4.09659px 13.4602px rgba(0, 0, 0, 0.05)' }
                        : { boxShadow: '0px 4.09659px 13.4602px rgba(245, 245, 245, 0.05)' }
                }
                     className="rounded-lg">
                    <div className="px-6 py-4 border-b border-divider dark:border-divider-dark">
                        <div className="font-bold text-sm">Description:</div>
                        <div className="mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark">
                            {data?.description?.[language]}

                            <div className="mt-1 font-normal italic text-xs sm:text-sm">
                                {data?.status === REWARD_STATUS.COMING_SOON &&
                                <div className="mt-1">
                                   Start at {formatTime(data?.expired_at, 'HH:mm dd-MM-yyyy')}
                                </div>
                                }
                                {data?.status === REWARD_STATUS.AVAILABLE &&
                                <div className="mt-1">
                                   Expired at {formatTime(data?.expired_at, 'HH:mm dd-MM-yyyy')}
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    <RewardList data={data} loading={loading}/>
                </div>
            </div>
        )
    }, [active, data, loading, language, theme])

    // useEffect(() => console.log('namidev-DEBUG: ', assetConfig), [assetConfig])

    return (
        <div id={`${REWARD_ID_KEY}_${data?.id}`} className="relative">
            <div className={rewardRowStyles}
                 onClick={() => !loading && data?.status === REWARD_STATUS.AVAILABLE && onToggleReward(data?.id, !active)}>
                <div className="flex items-center">
                    <div className="-mt-2.5">
                        {loading ?
                            <Skeletor
                                width={width < BREAK_POINTS.sm ? 24 : 32}
                                height={width < BREAK_POINTS.sm ? 24 : 32}
                                className="rounded-lg"
                            />
                            : <img src={data?.icon_url} alt="/images/icon/ic_nami.png"
                                   className="w-[24px] h-[24px] sm:w-[24px] sm:h-[24px]"/>
                        }
                    </div>
                    <div className="pl-3">
                        {loading ?
                            <Skeletor width={75} height={18}/>
                            : <div className="font-bold text-sm sm:text-[18px]">
                                {data?.title?.[language]}
                            </div>
                        }
                        {loading ?
                            <Skeletor width={55} height={12}/>
                            : <div className="font-medium text-xs sm:text-sm">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">Reward:</span>{' '}
                                <span className="text-dominant">
                                {formatNumber(data?.total_reward?.value, assetConfig?.assetDigit)}
                            </span>{' '}
                                <span>
                                <AssetName assetId={data?.total_reward?.assetId}/>
                            </span>
                            </div>
                        }
                    </div>
                </div>

                {width < BREAK_POINTS.lg
                && <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className={active ?
                        'transition-all duration-200 ease-in-out text-dominant rotate-90'
                        : 'transition-all duration-200 ease-in-out text-dominant'
                    }/>}
            </div>
            {renderRewardList()}
        </div>
    )
})

export default RewardItem
