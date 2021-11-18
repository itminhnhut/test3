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
            <div className="mal-modal min-w-[320px]">
                {isVisible &&
                <div className={'p-4 ' + className}>
                    {title && <div className="mt-3 text-center font-bold">{title}</div>}
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
