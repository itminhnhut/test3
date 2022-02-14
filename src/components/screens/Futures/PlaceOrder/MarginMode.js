import TradeSetings from 'components/svg/TradeSettings'

const FuturesMarginMode = () => {
    return (
        <div className='pt-5 flex items-center w-full'>
            <div className='flex-grow flex items-center w-full'>
                <div className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md'>
                    Isolated
                </div>
                <div className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md'>
                    20x
                </div>
            </div>
            <div className='-mr-1.5 w-8 h-7 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3'>
                <TradeSetings size={16} />
            </div>
        </div>
    )
}

export default FuturesMarginMode
