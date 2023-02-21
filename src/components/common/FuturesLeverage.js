import classNames from "classnames"

const FuturesLeverage = ({ value, className }) => <div className={classNames('px-1 py-[2px] bg-gray-11 dark:bg-dark-2 rounded-[3px] text-txtPrimary dark:text-gray-4 font-semibold text-xs leading-4', className)}>
    {value}x
</div>

export default FuturesLeverage