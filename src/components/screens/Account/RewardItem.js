import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { useSelector } from 'react-redux'
import { ChevronRight } from 'react-feather'
import { REWARD_STATUS } from 'components/screens/Account/_reward_data'
import { BREAK_POINTS } from 'constants/constants'
import { REWARD_ID_KEY } from 'pages/account/reward-center'
import { REWARD_BUTTON_STATUS } from 'components/screens/Account/RewardButton'

import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import RewardListItem from 'components/screens/Account/RewardListItem'
import AssetName from 'components/wallet/AssetName'
import Skeletor from 'components/common/Skeletor'
import RewardButton from 'components/screens/Account/RewardButton'

const RewardItem = memo(({ data, loading, active, onToggleReward, showGuide }) => {
    // Rdx
    const assetConfig = useSelector(state => state.utils.assetConfig?.find(o => o?.id === data?.total_reward?.assetId))

    // Use Hooks
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()
    const [theme, ] = useDarkMode()

    // Utilities
    const rewardRowStyles = useMemo(() => {

        const originClass = 'pl-4 py-3 pr-6 md:py-6 lg:px-8 xl:px-10 flex items-center justify-between lg:justify-start cursor-pointer select-none hover:bg-teal-lightTeal dark:hover:bg-teal-opacity'
        let className = ''

        if (data?.status === REWARD_STATUS.NOT_AVAILABLE) {
            className = originClass + 'cursor-not-allowed opacity-50 hover:bg-transparent'
        } else {
            if (active) {
                className = originClass + ' bg-teal-lightTeal dark:bg-teal-opacity'
            } else {
                className = originClass
            }
        }

        return className
    }, [data?.status, active])

    // Render Handler
    const renderRewardList = useCallback(() => {
        if (data?.status === REWARD_STATUS.NOT_AVAILABLE) return null

        const originClass = 'w-full invisible max-h-[0px] transition-all duration-200 ease-in-out pl-4 sm:pl-8 xl:pl-12 '
        let className = ''

        if (active) {
            className = originClass + '!visible !max-h-[2000px] pb-6'
        } else {
            className = originClass
        }

        return (
            <div className={className}>
                <div style={
                    theme === THEME_MODE.LIGHT ?
                        { boxShadow: '0px 4.09659px 13.4602px rgba(0, 0, 0, 0.05)' }
                        : null
                        // { boxShadow: '0px 4.09659px 13.4602px rgba(245, 245, 245, 0.05)' }
                }
                     className="rounded-b-lg bg-bgContainer dark:bg-bgContainer-dark">
                    {active &&
                    <>
                        <div className="pl-8 pr-6 py-4 lg:py-6 sm:pl-12 border-b border-divider dark:border-divider-dark">
                            <div className="font-bold text-sm md:text-[16px]">{t('common:description')}:</div>
                            <div className="mt-2 font-medium text-xs md:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                                {data?.description?.[language]}

                                <div className="mt-1 font-normal italic text-xs lg:text-sm">
                                    {data?.status === REWARD_STATUS.COMING_SOON &&
                                    <div className="mt-1">
                                        {t('common:start_at')} {formatTime(data?.expired_at, 'HH:mm dd-MM-yyyy')}
                                    </div>
                                    }
                                    {data?.status === REWARD_STATUS.AVAILABLE &&
                                    <div className="mt-1">
                                        {t('common:expired_at')} {formatTime(data?.expired_at, 'HH:mm dd-MM-yyyy')}
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <RewardListItem name={data?.id} data={data?.tasks} loading={loading} showGuide={showGuide}/>
                    </>}
                </div>
            </div>
        )
    }, [active, data, loading, language, theme])

    // useEffect(() => console.log('namidev-DEBUG: ', assetConfig), [assetConfig])

    return (
        <div id={`${REWARD_ID_KEY}_${data?.id}`} className="relative bg-bgContainer dark:bg-darkBlue">
            <div className={rewardRowStyles}
                 onClick={() => !loading && data?.status === REWARD_STATUS.AVAILABLE && onToggleReward(data?.id, !active)}>
                <div className="flex items-center lg:w-2/5">
                    <div className={loading ? '-mt-2.5' : ''}>
                        {loading ?
                            <Skeletor
                                width={width < BREAK_POINTS.sm ? 24 : 32}
                                height={width < BREAK_POINTS.sm ? 24 : 32}
                                className="rounded-lg"
                            />
                            : <img src={data?.icon_url} alt="/images/icon/ic_nami.png"
                                   className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"/>
                        }
                    </div>
                    <div className="pl-3 lg:pl-6">
                        {loading ?
                            <Skeletor width={75} height={18}/>
                            : <div className="font-bold text-sm md:text-[16px] lg:text-[18px]">
                                {data?.title?.[language]}
                            </div>
                        }
                        {loading ?
                            <Skeletor width={55} height={12}/>
                            : <div className="font-medium text-xs sm:text-sm lg:mt-1.5">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('reward-center:reward')}:</span>{' '}
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

                {width >= BREAK_POINTS.lg &&
                <div className="w-3/5 pl-10 flex items-center justify-between border-l border-divider dark:border-divider-dark">
                    <div style={{ width: `calc(100% - 250px)` }}>
                        {data?.notes?.[language]?.map(note => <div className="font-medium text-sm">{data?.notes?.[language]?.length > 1 ? '• ': null}{note}</div>)}
                    </div>
                    <div className="flex items-center">
                        {loading ?
                            <Skeletor
                                width={65}
                                height={25}
                                className="rounded-lg mr-3"
                            />
                            : <RewardButton href={data?.url_reference} target="_blank"
                                            title={t('common:view_rules')}
                                            status={REWARD_BUTTON_STATUS.AVAILABLE}
                                            buttonStyles="mr-3 min-w-[90px]"
                                            componentType="a"/>
                        }
                        {loading ?
                            <Skeletor
                                width={65}
                                height={25}
                                className="rounded-lg"
                            />
                            : <RewardButton title={t('reward-center:claim_all')}
                                            status={data?.tasks?.claimable_all ? REWARD_BUTTON_STATUS.AVAILABLE : REWARD_BUTTON_STATUS.NOT_AVAILABLE}
                                            buttonStyles="min-w-[90px]"
                                            onClick={() => alert(`Should claim all reward of ${data?.id}`)} />
                        }
                    </div>
                </div>}

                {width < BREAK_POINTS.lg
                && <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className={active ?
                        'transition-all duration-200 ease-in-out text-dominant rotate-90'
                        : 'transition-all duration-200 ease-in-out text-dominant'}
                    />}
            </div>
            {renderRewardList()}
        </div>
    )
})

export default RewardItem
