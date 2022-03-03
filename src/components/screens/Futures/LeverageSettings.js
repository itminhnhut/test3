import { useDispatch, useSelector } from 'react-redux'
import { SET_FUTURES_PRELOADED_LEVERAGE } from 'redux/actions/types'
import { Minus, Plus, X } from 'react-feather'

import InputSlider from 'src/components/trade/InputSlider'
import classNames from 'classnames'
import Button from 'components/common/Button'
import Modal from 'components/common/ReModal'
import SvgWarning from 'components/svg/SvgWarning'
import colors from 'styles/colors'

const FuturesLeverageSettings = ({ pair, isVisible, onClose }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='max-w-[306px]'
        >
            <div className='-mt-1 mb-3 flex items-center justify-between font-bold text-sm'>
                Adjust Leverage
                <div
                    className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                    onClick={onClose}
                >
                    <X size={16} />
                </div>
            </div>
            <div className='mb-1.5 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                Leverage
            </div>
            <div className='px-2 mb-4 h-[36px] flex items-center bg-gray-4 dark:bg-darkBlue-3 rounded-[4px]'>
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Minus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                    />
                </div>
                <input
                    defaultValue='25x'
                    className='px-2.5 flex-grow text-center text-sm font-medium'
                />
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Plus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                    />
                </div>
            </div>
            <div className='mb-3'>
                <InputSlider axis='x' x={25} xmax={125} />
            </div>
            <div className='mb-1 text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                *Maximum position at current leverage:{' '}
                <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                    1,000.000 USDT
                </span>
            </div>
            <span className='block mb-1 font-medium text-xs text-dominant'>
                Check on Leverage & Margin table
            </span>
            <span className='block mb-1 font-medium text-xs text-dominant'>
                Position Limit Enlarge
            </span>
            <div className='mt-2.5 flex items-start'>
                <div className='pt-1'>
                    <SvgWarning size={12} fill={colors.red2} />
                </div>
                <div className='pl-2.5 font-medium text-xs text-red'>
                    Selecting higher leveragte such as [10x] increases your
                    liquidation risk. Always manage your rish levels. See help
                    articles for more information.
                </div>
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

export default FuturesLeverageSettings
