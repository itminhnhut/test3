import Button from 'components/common/Button'

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
    type = 'alert'
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
                    <Button title={positiveLabel || 'Xác nhận'} type="primary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onConfirmCb && onConfirmCb()}/>
                    <Button title={negativeLabel || 'Đóng'} type="secondary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onCloseCb && onCloseCb()}/>
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
            <div className="mal-modal">
                {isVisible &&
                <div className="mal-modal__wrapper">
                    {title && <div className="mal-modal__title">{title}</div>}
                    {children}
                    <div className="flex flex-row items-center justify-between mt-5">
                        {renderButtonGroup()}
                    </div>
                </div>}
            </div>
        </>
    )
}

export default Modal
