import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronRight } from 'react-feather'
import { useSelector } from 'react-redux'
import { formatNumber } from 'redux/actions/utils'
import { CLAIM_STATUS, TASK_PROPS_TYPE } from 'components/screens/Account/_reward_data'
import AssetName from 'components/wallet/AssetName'
import RewardButton, { REWARD_BUTTON_STATUS } from 'components/screens/Account/RewardButton'
import RewardType from 'components/screens/Account/RewardType'
import DashedProgressLine from 'components/screens/Account/DashedProgressLine'

const INITIAL_STATE = {
    rewardItemExpand: {},

    // ...
}

const RewardListItem = ({ name, data, loading }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))
    const [testCompleteTaskAnimation, setTestCompleteTaskAnimation] = useState(false)

    // Rdx
    const configs = useSelector(state => state.utils?.assetConfig)

    // Use Hooks
    const { t, i18n: { language } } = useTranslation()

    const renderList = useCallback(() => {
        return data?.task_list?.map((task, index) => {
            const { task_id, task_title, task_props, task_reward: { assetId, value }, icon_url, description } = task

            let assetConfig

            if (task_props?.type === TASK_PROPS_TYPE.MULTISTEP) {
                assetConfig = configs?.find(o => o?.id === assetId)
            } else if (task_props?.type === TASK_PROPS_TYPE.REACH_TARGET) {
                assetConfig = configs?.find(o => o?.id === task_props?.metadata?.assetId)
            }

            const isActive = state.rewardItemExpand?.[`${task_id}`]
            const isLastedItem = data?.task_list?.length === index + 1

            const originClass = 'relative flex items-stretch transition-all duration-200 ease-in-out max-h-[0px] invisible opacity-0 '
            let activeRewardList

            if (isActive) {
                activeRewardList = originClass + '!max-h-[800px] !visible !opacity-100'
            } else {
                activeRewardList = originClass
            }


            return (
                <div key={task_id} className="relative pb-4">
                    <div className="pt-4 flex items-stretch">
                        <div className="relative flex items-center justify-center">
                            <div className="relative z-30 w-[40px] h-[40px] bg-bgContainer dark:bg-bgContainer-dark flex items-center justify-center overflow-hidden">
                                <img src={icon_url} className="w-[24px] h-[24px] " alt="" />
                                {isLastedItem &&
                                <div className="w-[40px] h-[250%] absolute z-20 bg-bgContainer dark:bg-bgContainer-dark top-full left-0"/>}
                            </div>
                            {!isLastedItem &&
                            <div style={{ height: `calc(100% + ${isActive ? 90 : 40}px)`, top: '50%' }}
                                 className="absolute z-10 left-1/2 -translate-x-1/2">
                                <DashedProgressLine dashedSize={8} offset={3}
                                                    completed={testCompleteTaskAnimation} // !TODO: Set to True if this task is claim success
                                                    progressLineClass="!duration-500"
                                                    isMore={isActive} />
                            </div>}
                        </div>

                        {/*Reward list item info*/}
                        <div style={{ width: 'calc(100% - 40px)' }} className="ml-3.5 pr-4">
                            <div className="relative w-full cursor-pointer"
                                 onClick={() => setState({ rewardItemExpand: { ...state.rewardItemExpand, [task_id]: !state.rewardItemExpand?.[`${task_id}`] } })}>
                                <div className="font-bold text-sm sm:text-[18px] max-w-[80%]">
                                    {index + 1}. {task_title?.[language]} {/*{index === 1 ? 'ipsum nonstop lorem ipsum nonstop lorem i' : 'ipsum nonstop lorem ipsum nonstop lorem ipsum nonstop'}*/}
                                </div>
                                <ChevronRight size={16} strokeWidth={1.5}
                                              className={isActive ?
                                                  'absolute top-[2px] right-0 text-txtSecondary dark:text-txtSecondary-dark transition-all duration-200 ease-in rotate-90'
                                              : 'absolute top-[2px] right-0 text-txtSecondary dark:text-txtSecondary-dark transition-all duration-200 ease-in'}/>
                            </div>
                            <div className="mt-3 flex items-center justify-between font-medium text-xs sm:text-sm">
                                <div>
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark">Reward:</span>
                                    <span className="mx-0.5 text-dominant">{formatNumber(value, assetConfig?.assetDigit)}</span>
                                    <AssetName assetId={assetId}/>
                                </div>
                                {isActive &&
                                <div>
                                    {description?.toString()
                                        ?.startsWith('http') ?
                                        <a href={description} target="_blank"
                                           className="text-dominant text-xs sm:text-sm !underline hover:!underline hover:opacity-80"
                                           onClick={e => e?.stopPropagation()}
                                        >
                                            {t('reward-center:guide')}
                                        </a>
                                        : <div className="text-dominant text-xs sm:text-sm !underline hover:opacity-80 cursor-pointer"
                                               onClick={e => e?.stopPropagation()}>
                                            {t('reward-center:guide')}
                                        </div>
                                    }
                                </div>}
                            </div>
                        </div>
                    </div>

                    {/*Reward list item dropdown*/}
                    <div className={activeRewardList}>

                        <div className="flex items-center justify-center">
                            <div className="w-[40px] h-[40px] max-w-[40px] flex items-center justify-center">
                                {/*Leave this block empty*/}
                            </div>
                        </div>

                        {/*Reward content base on Task type*/}
                        <div style={{ width: 'calc(100% - 40px)' }} className="ml-3.5 pr-4">
                            <RewardType data={task} active={isActive} assetConfig={assetConfig}/>
                        </div>
                    </div>
                    {!isLastedItem && <div style={{ width: 'calc(100% - 40px)' }} className="absolute bottom-0 -right-3.5 h-[1px] bg-divider dark:bg-divider-dark"/>}
                    {isActive && isLastedItem &&
                    <div style={{ width: 'calc(100% - 40px)' }} className="absolute bottom-0 -right-3.5 h-[1px] bg-divider dark:bg-divider-dark"/>}
                </div>
            )
        })
    }, [state.rewardItemExpand, data?.task_list, loading, configs, language, testCompleteTaskAnimation])

    const renderClaimAllBtn = useCallback(() => {
        let isClaimableAll = data?.claimable_all

        return (
            <div className="mt-3.5 flex justify-center">
                <RewardButton title={!isClaimableAll ? t('reward-center:button_status.claimed') : t('reward-center:claim_all')}
                              status={isClaimableAll ? REWARD_BUTTON_STATUS.AVAILABLE : REWARD_BUTTON_STATUS.NOT_AVAILABLE}
                              onClick={() => alert(`should Claim all Reward: ${name} !`)}
                              buttonStyles="mt-2 mb-7"
                />
            </div>
        )
    }, [data])

    useEffect(() => {
        setTimeout(() => setTestCompleteTaskAnimation(true), 2000)
    }, [])

    useEffect(() => {
        console.log('namidev-DEBUG: RewardList Item => ', state)
    }, [state])

    return (
        <div>
            <div className="pl-8 sm:pl-10 sm:py-5">
                {renderList()}
            </div>
            {renderClaimAllBtn()}
        </div>
    )
}

export default RewardListItem
