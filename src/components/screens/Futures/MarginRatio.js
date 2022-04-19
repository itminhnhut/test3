import SpeedMeter from 'components/svg/SpeedMeter';
import { ChevronDown } from 'react-feather';

const FuturesMarginRatio = ({ pairConfig }) => {
    return (
        <div className='pt-5 h-full !overflow-x-hidden overflow-y-auto'>
            <div className='px-[10px] pb-5 border-b border-divider dark:border-divider-dark'>
                <div className='flex items-center justify-between'>
                    <div className='futures-component-title flex-grow dragHandleArea'>
                        Margin Ratio
                    </div>
                    <div className='w-[24px] h-[24px] flex items-center justify-center rounded-md cursor-pointer hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                        {/* <X size={16} strokeWidth={1} /> */}
                    </div>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Margin Ratio
                    </span>
                    <span className='flex items-center'>
                        <SpeedMeter className='mr-2' />{' '}
                        <span className='font-bold text-[18px] text-dominant'>
                            0.01%
                        </span>
                    </span>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Maintenance Margin
                    </span>
                    <span className='flex items-center'>
                        0.000{' '}
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Margin Balance
                    </span>
                    <span className='flex items-center'>
                        106.301{' '}
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
            </div>
            <div className='pt-4 pb-5 px-[10px]'>
                <div className='flex items-center justify-between'>
                    <span className='futures-component-title'>Assets</span>
                    <span className='flex items-center'>
                        {pairConfig?.quoteAsset}
                        <ChevronDown
                            size={16}
                            strokeWidth={1}
                            className='ml-1'
                        />
                    </span>
                </div>
                <div className='mt-4 flex items-center'>
                    <div className='px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        Buy Crypto
                    </div>
                    <div className='px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        Convert
                    </div>
                    <div className='px-[14px] py-1 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        Transfer
                    </div>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Balance
                    </span>
                    <span className='flex items-center'>
                        106.301{' '}
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Unrealized PNL
                    </span>
                    <span className='flex items-center'>
                        106.301{' '}
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default FuturesMarginRatio
