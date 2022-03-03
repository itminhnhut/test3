import { useDispatch, useSelector } from 'react-redux'
import { SET_FUTURES_PRELOADED_FORM } from 'redux/actions/types'
import { FuturesMarginMode as MarginModes } from 'redux/reducers/futures'
import { X } from 'react-feather'

import classNames from 'classnames'
import Modal from 'components/common/ReModal'
import Button from 'components/common/Button'

const FuturesMarginModeSettings = ({ isVisible, onClose }) => {
    const marginMode = useSelector(
        (state) => state.futures.preloadedState?.marginMode || MarginModes.Cross
    )

    const dispatch = useDispatch()
    const setMarginMode = (marginMode) =>
        dispatch({
            type: SET_FUTURES_PRELOADED_FORM,
            payload: { marginMode },
        })

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='max-w-[306px]'
        >
            <div className='-mt-1.5 mb-3 flex items-center justify-between font-bold text-sm'>
                BTC/USDT Perpetual Margin Mode
                <div
                    className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                    onClick={onClose}
                >
                    <X size={16} />
                </div>
            </div>
            <div className='mb-3 flex items-center justify-between'>
                <div
                    onClick={() => setMarginMode(MarginModes.Cross)}
                    className={classNames(
                        'w-[48%] py-1.5 font-medium text-center text-sm text-txtSecondary dark:text-txtSecondary-dark rounded-[4px] select-none border border-divider dark:border-divider-dark cursor-pointer hover:text-dominant hover:border-dominant',
                        {
                            '!text-dominant !border-dominant':
                                marginMode === MarginModes.Cross,
                        }
                    )}
                >
                    Cross
                </div>
                <div
                    onClick={() => setMarginMode(MarginModes.Isolated)}
                    className={classNames(
                        'w-[48%] py-1.5 font-medium text-center text-sm text-txtSecondary dark:text-txtSecondary-dark rounded-[4px] select-none border border-divider dark:border-divider-dark cursor-pointer hover:text-dominant hover:border-dominant',
                        {
                            '!text-dominant !border-dominant':
                                marginMode === MarginModes.Isolated,
                        }
                    )}
                >
                    Isolated
                </div>
            </div>
            <div className='pb-3 mb-3 border-b border-divider dark:border-divider-dark font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                *Switching the margin mode will only apply it to the selected
                contract.
            </div>
            <div className='text-xs mb-2.5'>
                <span className='font-bold'>Isolated Margin:</span>{' '}
                <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                    là chế độ mà ở đó cho phép lượng margin của một vị thế được
                    giới hạn trong một khoảng nhất định. Khi tới ngưỡng thanh
                    lý, mọi người chỉ mất đi số tiền đặt vào vị thế đó.
                </span>
            </div>
            <div className='text-xs mb-5'>
                <span className='font-bold'>Cross Margin:</span>{' '}
                <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                    là chế độ mà ở đó cho phép các vị thế sử dụng tất cả số dư
                    trong tài khoản cross để tránh việc bị thanh lý. Nhưng khi
                    xảy ra việc thanh lý, mọi người sẽ mất toàn bộ số dư trong
                    tài khoản và tất cả các vị thế đang mở.
                </span>
            </div>
            <div className='mt-5 mb-2'>
                <Button
                    title='Confirm'
                    componentType='button'
                    type='primary'
                    onClick={onClose}
                />
            </div>
        </Modal>
    )
}

export default FuturesMarginModeSettings
