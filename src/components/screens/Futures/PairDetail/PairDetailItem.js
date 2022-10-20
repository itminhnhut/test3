import classNames from 'classnames';

const FuturesPairDetailItem = ({
    label = 'Label',
    value = '--',
    containerClassName,
    labelClassName,
    valueClassName,
    icon
}) => {
    return (
        <div className={classNames('w-auto font-medium', containerClassName)}>
            <div
                className={classNames(
                    'font-medium text-[10px] text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap select-none flex items-center space-x-1',
                    labelClassName
                )}
            >
                <span>{label}</span>
                {icon && icon}
            </div>
            <div
                className={classNames(
                    'text-xs whitespace-nowrap',
                    valueClassName
                )}
            >
                {value}
            </div>
        </div>
    )
}

export default FuturesPairDetailItem
