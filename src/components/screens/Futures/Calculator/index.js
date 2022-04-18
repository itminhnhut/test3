import { useState } from 'react'
import { X } from 'react-feather'

import classNames from 'classnames'
import Modal from 'components/common/ReModal'
import FuturesCalculatorPML from './PML'
import FuturesCalculatorTargetPrice from './TargetPrice'
import FuturesCalculatorLiqPrice from './LiqPrice'

const FuturesCalculator = ({ isVisible, onClose }) => {
    const [tabIndex, setTabIndex] = useState(0)

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='p-0 pb-6 w-[596px] dark:border border-divider-dark top-[50%]'
        >
            <div className='-mt-1 p-5 pb-4 flex items-center justify-between font-bold text-sm'>
                Futures Calculator
                <div
                    className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                    onClick={onClose}
                >
                    <X size={16} />
                </div>
            </div>
            <div className='px-5 flex border-b border-divider dark:border-divider-dark select-none'>
                <div
                    className={classNames(
                        'relative mr-[28px] pb-2 cursor-pointer text-txtSecondary dark:text-txtSecondary-dark font-medium',
                        {
                            '!font-bold !text-txtPrimary dark:!text-txtPrimary-dark':
                                tabIndex === 0,
                        }
                    )}
                    onClick={() => setTabIndex(0)}
                >
                    PML
                    <div
                        className={classNames(
                            'absolute hidden w-[40px] h-[2px] bg-dominant left-1/2 bottom-0 -translate-x-1/2',
                            { '!block': tabIndex === 0 }
                        )}
                    />
                </div>
                <div
                    className={classNames(
                        'relative mr-[28px] pb-2 cursor-pointer text-txtSecondary dark:text-txtSecondary-dark font-medium',
                        {
                            '!font-bold !text-txtPrimary dark:!text-txtPrimary-dark':
                                tabIndex === 1,
                        }
                    )}
                    onClick={() => setTabIndex(1)}
                >
                    Target Price
                    <div
                        className={classNames(
                            'absolute hidden w-[40px] h-[2px] bg-dominant left-1/2 bottom-0 -translate-x-1/2',
                            { '!block': tabIndex === 1 }
                        )}
                    />
                </div>
                <div
                    className={classNames(
                        'relative mr-[28px] pb-2 cursor-pointer text-txtSecondary dark:text-txtSecondary-dark font-medium',
                        {
                            '!font-bold !text-txtPrimary dark:!text-txtPrimary-dark':
                                tabIndex === 2,
                        }
                    )}
                    onClick={() => setTabIndex(2)}
                >
                    Liquidation Price
                    <div
                        className={classNames(
                            'absolute hidden w-[40px] h-[2px] bg-dominant left-1/2 bottom-0 -translate-x-1/2',
                            { '!block': tabIndex === 2 }
                        )}
                    />
                </div>
            </div>
            {tabIndex === 0 && <FuturesCalculatorPML />}
            {tabIndex === 1 && <FuturesCalculatorTargetPrice />}
            {tabIndex === 2 && <FuturesCalculatorLiqPrice />}
            <div className='mt-5 px-5 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                See what the potential risk and reward will be in monetary terms
                on any give trade. Use our Futures Calculator to establish your
                potential profit/loss on a future trade. Read{' '}
                <span className='text-dominant underline cursor-pointer hover:opacity-75'>
                    tips
                </span>{' '}
                on how to use
            </div>
        </Modal>
    )
}

export default FuturesCalculator
