import Button from 'src/components/common/Button'

import { useCallback } from 'react'

const Modal = ({
    isVisible,
    children,
    title,
    positiveLabel,
    negativeLabel,
    onConfirmCb,
    onCloseCb,
    onBackdropCb,
    className = '',
    type = 'alert',
    noButton = false,
    titleStyle
}) => {

    const renderButtonGroup = useCallback(() => {

        if (type === 'confirm-one-choice') {
            return <Button title={positiveLabel || 'Xác nhận'} type="primary"
                           componentType="button"
                           onClick={() => onConfirmCb && onConfirmCb()}/>
        }

        if (type === 'confirmation') {
            return (
                <>
                    <Button title={negativeLabel || 'Đóng'} type="secondary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onCloseCb && onCloseCb()}/>
                    <Button title={positiveLabel || 'Xác nhận'} type="primary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onConfirmCb && onConfirmCb()}/>
                </>
            )
        }

        if (type === 'alert') {
          return <Button title={negativeLabel || 'Đóng'} type="secondary"
                         componentType="button"
                         onClick={() => onCloseCb && onCloseCb()}/>
        }
    }, [type, positiveLabel, negativeLabel, onConfirmCb, onCloseCb])

    return (
        <>
            <div className={`mal-overlay ${isVisible ? 'mal-overlay__active' : ''}`}
                 onClick={() => onBackdropCb && onBackdropCb()}/>
            <div className="mal-modal min-w-[280px]">
                {isVisible &&
                <div className={'p-4 ' + className}>
                    {title && <div className={titleStyle ? 'mt-3 text-center font-bold ' + titleStyle : 'mt-3 text-center font-bold'}>{title}</div>}
                    {children}
                    {!noButton && <div className="flex flex-row items-center justify-between mt-5">
                        {renderButtonGroup()}
                    </div>}
                </div>}
            </div>
        </>
    )
}

export default Modal
