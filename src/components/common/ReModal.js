import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { PulseLoader } from 'react-spinners'
import { log } from 'utils'

import Button from 'components/common/Button'
import colors from 'styles/colors'
import { X } from 'react-feather'

const ReModal = (
    {
        children,
        isVisible,
        useOverlay = false,
        useCrossButton = false,
        onBackdropCb,
        useButtonGroup = REMODAL_BUTTON_GROUP.CONFIRM,
        style = {},
        title = null,
        className = '',
        buttonGroupWrapper = '',
        position = REMODAL_POSITION.BOTTOM,
        positiveLabel,
        negativeLabel,
        onPositiveCb,
        onPositiveLoading,
        onNegativeCb,
        debug = false,
    }
) => {

    // Re-MODAL
    const { t } = useTranslation(['common'])

    const memmoizedStyles = useMemo(() => {
        let _className = DEFAULT_CLASS
        let _active

        switch (position) {
            case REMODAL_POSITION.TOP:
                _className += 'left-0 top-0 -translate-y-full rounded-br-[16px] rounded-bl-[16px]'
                _active = '!translate-y-0'
                break
            case REMODAL_POSITION.LEFT:
                _className += 'right-0 top-0 w-[80%] h-full translate-x-full rounded-tl-[16px] rounded-bl-[16px]'
                _active = '!translate-x-0'
                break
            case REMODAL_POSITION.RIGHT:
                _className += 'left-0 top-0 w-[80%] h-full -translate-x-full rounded-tr-[16px] rounded-br-[16px]'
                _active = '!translate-x-0'
                break
            case REMODAL_POSITION.BOTTOM:
                _className += 'left-0 bottom-0 translate-y-full rounded-tr-[16px] rounded-tl-[16px]'
                _active = '!translate-y-0'
                break
            case REMODAL_POSITION.CENTER:
                _className += '!transition-none min-w-[282px] max-w-[380px] left-1/2 top-1/2 w-[85%] rounded-xl -translate-x-1/2 -translate-y-1/2 invisible'
                _active = '!visible'
                break
        }

        if (position?.mode === REMODAL_POSITION.FULLSCREEN.MODE) {
            if (position?.from === REMODAL_POSITION.FULLSCREEN.FROM.LEFT) {
                _className += 'p-0 left-0 top-0 w-screen h-screen -translate-x-full'
                _active = '!translate-x-0'
            }

            if (position?.from === REMODAL_POSITION.FULLSCREEN.FROM.RIGHT) {
                _className += 'p-0 right-0 top-0 w-screen h-screen translate-x-full'
                _active = '!translate-x-0'
            }
        }

        return {
            className: _className + ` ${className}`,
            active: _active
        }
    }, [className, position])

    const renderButtonGroup = useCallback(() => {

        if (useButtonGroup === REMODAL_BUTTON_GROUP.NOT_USE) return null

        if (useButtonGroup === REMODAL_BUTTON_GROUP.SINGLE_CONFIRM) {
            return (
                <div className="w-full flex flex-row items-center justify-between mt-5">
                    <Button title={onPositiveLoading ? <PulseLoader color={colors.white} size={3}/> : (positiveLabel || t('common:confirm'))} type="primary"
                            componentType="button"
                            onClick={() => onPositiveCb && onPositiveCb()}/>
                </div>
            )
        }

        if (useButtonGroup === REMODAL_BUTTON_GROUP.CONFIRM) {
            return (
                <div className="w-full flex flex-row items-center justify-between mt-5">
                    <Button title={negativeLabel || t('common:close')} type="secondary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onNegativeCb && onNegativeCb()}/>
                    <Button title={onPositiveLoading ? <PulseLoader color={colors.white} size={3}/> : (positiveLabel || t('common:confirm'))} type="primary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onPositiveCb && onPositiveCb()}/>
                </div>
            )
        }

        if (useButtonGroup === REMODAL_BUTTON_GROUP.ALERT) {
            return (
                <div className="w-full flex flex-row items-center justify-between mt-5">
                    <Button title={onPositiveLoading ? <PulseLoader color={colors.white} size={3}/> : (negativeLabel || t('common:close'))} type="secondary"
                            componentType="button"
                            onClick={() => {
                                if (onNegativeCb) {
                                    onNegativeCb()
                                } else if (onPositiveCb) {
                                    onPositiveCb()
                                }
                            }}/>
                </div>)
        }
    }, [useButtonGroup, positiveLabel, negativeLabel, onPositiveCb, onPositiveLoading, onNegativeCb])

    useEffect(() => {
        debug && log.d('[ReModal] isVisible => ', isVisible)
    }, [isVisible, debug])

    return (
        <>
            {useOverlay && position !== REMODAL_POSITION.FULLSCREEN.MODE &&
            <div className={`mal-overlay ${isVisible ? 'mal-overlay__active' : ''}`}
                 onClick={() => {
                     debug && log.d('[ReModal] onBackdropCb triggered!')
                     onBackdropCb && onBackdropCb()
                 }}/>}

            <div style={style || {}} className={isVisible ? `${memmoizedStyles.className} ${memmoizedStyles.active}` :  memmoizedStyles?.className}>
                <div style={position?.mode === REMODAL_POSITION.FULLSCREEN.MODE ?
                    { width: '100%', height: 50, display: 'flex',
                        alignItems: 'center', justifyItems: 'center',
                        paddingLeft: '16px', paddingRight: '16px'} : undefined}
                               className="relative text-center font-bold lg:mt-6 text-[18px] lg:text-[26px]">
                    <div className="m-auto">
                        {title ? title : ''}
                    </div>
                    {useCrossButton &&  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[35px] h-[35px] flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-4 dark:hover:bg-darkBlue-4"
                                             onClick={() => onNegativeCb && onNegativeCb()}>
                        <X strokeWidth={1.5} className="w-[20px] h-[20px] text-txtSecondary dark:text-txtSecondary-dark"/>
                    </div>}
                </div>

                <div style={position?.mode === REMODAL_POSITION.FULLSCREEN.MODE ?
                    {
                        height: `calc(100% - 65px - 50px - 20px)`,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingLeft: '16px', paddingRight: '16px'
                    }
                    : undefined
                }>
                    {isVisible && children}
                </div>

                <div style={position?.mode === REMODAL_POSITION.FULLSCREEN.MODE ?
                    { width: '100%', height: 65, display: 'flex',
                        alignItems: 'center', justifyItems: 'center',
                        paddingLeft: '16px', paddingRight: '16px' } : undefined}
                     className={buttonGroupWrapper}>
                    {renderButtonGroup()}
                </div>
            </div>
        </>
    )
}

const DEFAULT_CLASS = 'p-4 fixed z-[9999999999] min-w-[282px] w-full bg-bgContainer dark:bg-darkBlue-2 transition-all duration-200 ease-in-out '

export const REMODAL_POSITION = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    CENTER: 'center',
    FULLSCREEN: {
        MODE: 'full-screen',
        FROM: {
            LEFT: 'left',
            RIGHT: 'right'
        }
    }
}

export const REMODAL_BUTTON_GROUP = {
    ALERT: 'alert',
    SINGLE_CONFIRM: 'single_confirm',
    CONFIRM: 'confirm',
    NOT_USE: 'not_use'
}

export default ReModal
