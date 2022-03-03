const FuturesRecordSymbolItem = ({ symbol, leverage }) => {
    return (
        <div className='pl-2 flex items-center whitespace-nowrap'>
            <div className='font-medium text-xs'>
                <div>{symbol}</div>
                <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                    Perpetual
                </div>
            </div>
            {leverage && (
                <div className='ml-2 px-2  bg-gray-4 dark:bg-darkBlue-3 font-medium text-dominant text-[9px] rounded-sm'>
                    {leverage}
                </div>
            )}
        </div>
    )
}

export default FuturesRecordSymbolItem
