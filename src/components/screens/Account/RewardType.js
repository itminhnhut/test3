import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { formatNumber } from 'redux/actions/utils'
import { CLAIM_STATUS, REWARD_STATUS, STEP_TYPE, TASK_ACTIONS, TASK_PROPS_TYPE, TASK_STATUS } from 'components/screens/Account/_reward_data'

import RewardButton, { REWARD_BUTTON_STATUS } from 'components/screens/Account/RewardButton'
import useIsFirstRender from 'hooks/useIsFirstRender'
import CountUp from 'react-countup'
import { BREAK_POINTS } from 'constants/constants'
import useWindowSize from 'hooks/useWindowSize'

const RewardType = memo(({ data, active, assetConfig }) => { // !NOTE: data?. is the whole things of task item in tasks?.task_list
    // Init state
    const [reachedProgress, setReachedProgress] = useState(0)

    // Use hooks
    const { t, i18n: { language } } = useTranslation()
    const isFirst = useIsFirstRender()
    const { width } = useWindowSize()

    // Render Handler
    const renderContent = useCallback(() => {
        const type = data?.task_props?.type

        switch (type) {
            case TASK_PROPS_TYPE.MULTISTEP:
                const index = data?.task_props?.metadata?.current_step_index
                const currentStep = data?.task_props?.metadata?.steps?.[index]

                let textClass = ''
                let stepIcon = null

                if (currentStep?.type === STEP_TYPE.PENDING) {
                    textClass = 'text-yellow'
                    stepIcon = '/images/icon/warning.png'
                } else if (currentStep?.type === STEP_TYPE.FINISHED) {
                    textClass = 'text-dominant'
                    stepIcon = '/images/icon/success.png'
                }

                return (
                    <div style={width >= BREAK_POINTS.lg ? { width: 'calc(100% - 250px)' } : undefined}
                         className={'mt-3 mb-4 text-xs sm:text-sm flex items-center w-full ' + textClass}>
                        {stepIcon &&
                        <img src={stepIcon}
                             className="w-[16px] h-[16px] sm:w-[24px] sm:h-[24px] mr-1.5"
                             alt={null}/>}
                        <span>{currentStep?.[language]}</span>
                    </div>
                )
            case TASK_PROPS_TYPE.REACH_TARGET:
                const target = data?.task_props?.metadata?.target
                const reached = data?.task_props?.metadata?.reached

                return (
                    <div className="my-4 w-full flex items-center font-medium">
                        <div className="w-1/2 sm:w-2/3 md:w-3/4 lg:w-1/2 relative rounded-lg overflow-hidden h-[3.65px] lg:h-[5px] bg-teal-lightTeal dark:bg-teal-opacity">
                            <div style={{ width: reachedProgress + '%' }}
                                 className="absolute h-full top-0 left-0 bg-dominant rounded-lg transition-all duration-200 ease-in"/>
                        </div>
                        <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/2 text-right text-xs md:text-sm lg:pr-4 xl:ml-8">
                            <span className="text-dominant">
                                {/*{isFirst && !reachedProgress ?*/}
                                {/*    <CountUp end={reached}*/}
                                {/*             duration={0.2}*/}
                                {/*             delay={0.4}*/}
                                {/*             formattingFn={(value) => formatNumber(value, assetConfig?.assetDigit)}*/}
                                {/*    >*/}
                                {/*        {({ countUpRef }) => <span ref={countUpRef}/>}*/}
                                {/*    </CountUp>*/}
                                {/*    : formatNumber(reached, assetConfig?.assetDigit)*/}
                                {/*}*/}
                                {formatNumber(reached, assetConfig?.assetDigit)}
                            </span>
                            /<span>{formatNumber(target, assetConfig?.assetDigit)}</span>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }, [data?.task_props?.type, data?.task_props?.metadata, reachedProgress, language, isFirst, width, assetConfig])

    const renderButtonGroup = useCallback(() => {
        const buttonGroup = []

        data?.task_props?.metadata?.actions?.forEach((action, index) => {
            // !TODO: Handle submit Task Action
            const rewardProps = handleRewardButtonProps(action?.type, { ...data, t })

            buttonGroup.push(
                <RewardButton key={`reward_button_${index}`} title={rewardProps?.title || action?.[language]}
                              buttonStyles={index + 1 === data?.task_props?.metadata?.actions?.length ?
                                  'w-[47%] max-w-[47%] xl:min-w-[90px] xl:w-[120px]'
                                  : 'w-[47%] max-w-[47%] xl:min-w-[90px] xl:w-[120px] mr-3'}
                              status={rewardProps?.status}
                              onClick={rewardProps?.onClick}
                />
            )
        })

        return (
            <div className="flex items-center lg:justify-end lg:min-w-[200px] xl:min-w-[350px] xl:w-[400px]">
                {buttonGroup}
            </div>
        )
    }, [data])

    useEffect(() => {
        const target = data?.task_props?.metadata?.target
        const reached = data?.task_props?.metadata?.reached
        const progress = Math.floor(reached / target * 100)

        if (active) {
            setTimeout(() => setReachedProgress(progress), 500)
        }

    }, [active, data?.task_props?.metadata])

    return (
        <>
            {renderContent()}
            {renderButtonGroup()}
        </>
    )
})

const handleRewardButtonProps = (action, payload) => {
    console.log('namidev-DEBUG: handleRewardButtonProps ', payload)

    let isCompleted
    const taskType = payload?.task_props?.type

    if (taskType === TASK_PROPS_TYPE.MULTISTEP) {
        isCompleted = (payload?.task_props?.metadata?.current_step_index + 1) === payload?.task_props?.metadata?.steps?.length
    } else if (taskType === TASK_PROPS_TYPE.REACH_TARGET) {
        isCompleted = payload?.task_props?.metadata?.reached === payload?.task_props?.metadata?.target
    } else {
        isCompleted = false
    }


    switch (action) {
        case TASK_ACTIONS.USER.KYC:
            return  {
                title: isCompleted ? payload?.t('reward-center:button_status.completed') : undefined,
                status: isCompleted ? REWARD_BUTTON_STATUS.NOT_AVAILABLE : REWARD_BUTTON_STATUS.AVAILABLE,
                onClick: () => !isCompleted && alert(`Trigger action KYC for ${payload?.task_id}`)
            }
        case TASK_ACTIONS.USER.DEPOSIT:
            return {
                title: isCompleted ? payload?.t('reward-center:button_status.completed') : undefined,
                status: isCompleted ? REWARD_BUTTON_STATUS.NOT_AVAILABLE : REWARD_BUTTON_STATUS.AVAILABLE,
                onClick: () => !isCompleted && alert(`Trigger action DEPOSIT for ${payload?.task_id}`)
            }
        case TASK_ACTIONS.USER.WITHDRAW:
            return {
                title: isCompleted ? payload?.t('reward-center:button_status.completed') : undefined,
                status: isCompleted ? REWARD_BUTTON_STATUS.NOT_AVAILABLE : REWARD_BUTTON_STATUS.AVAILABLE,
                onClick: () => !isCompleted && alert(`Trigger action WITHDRAW for ${payload?.task_id}`)
            }
        case TASK_ACTIONS.USER.TRANSFER:

        case TASK_ACTIONS.TRADE.SPOT.BUY:
        case TASK_ACTIONS.TRADE.SPOT.SELL:
        case TASK_ACTIONS.TRADE.SPOT.SWAP:

        case TASK_ACTIONS.TRADE.FUTURES.BUY:
        case TASK_ACTIONS.TRADE.FUTURES.SELL:
        case TASK_ACTIONS.TRADE.FUTURES.COPY_TRADE:

        case TASK_ACTIONS.EARN.FARM:
        case TASK_ACTIONS.EARN.STAKE:

        case TASK_ACTIONS.CLAIM:
            const isClaimed = payload?.task_props?.claim_status === CLAIM_STATUS.CLAIMED
            const isNotAvailable = payload?.task_props?.claim_status === CLAIM_STATUS.NOT_AVAILABLE

            let title

            if (!isCompleted || isNotAvailable) {
                title = payload?.t('reward-center:claim')
            } else if (isClaimed) {
                title = payload?.t('reward-center:button_status.claimed')
            }

            const shouldDisable = !(isCompleted && !isClaimed && !isNotAvailable)

            return {
                title: title, //!shouldDisable ? payload?.t('reward-center:claim') : payload?.t('reward-center:button_status.claimed'),
                status: !shouldDisable ? REWARD_BUTTON_STATUS.AVAILABLE : REWARD_BUTTON_STATUS.NOT_AVAILABLE,
                onClick: () => alert(`Trigger action claim for ${payload?.task_id}`)
            }
    }
}

export default RewardType
