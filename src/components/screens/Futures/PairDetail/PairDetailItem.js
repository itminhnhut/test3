import classNames from 'classnames';

const FuturesPairDetailItem = ({ label = 'Label', value = '--', containerClassName, labelClassName, valueClassName, icon }) => {
    return (
        <div className={classNames('w-auto font-semibold text-xs text-left space-y-2 dark:text-txtPrimary-dark', containerClassName)}>
            <div
                className={classNames(
                    'font-normal text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap select-none flex items-center justify-start',
                    labelClassName
                )}
            >
                <span>{label}</span>
                {icon && icon}
            </div>
            <div className={classNames('text-xs whitespace-nowrap', valueClassName)}>{value}</div>
        </div>
    );
};

export default FuturesPairDetailItem;
