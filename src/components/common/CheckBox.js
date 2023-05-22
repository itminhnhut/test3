import classNames from 'classnames';
import { Check } from 'react-feather';

const CheckBox = ({ active, boxContainerClassName, label, labelClassName, onChange, className, onusMode = false, isV3 = false, isDisable = false }) => {
    const onCheck = () => onChange && onChange();
    return (
        <div onClick={onCheck} className={classNames('flex items-center select-none cursor-pointer space-x-3 w-max', className)}>
            <div
                className={classNames(
                    'w-4 h-4 flex items-center justify-center rounded-[3px] border border-divider dark:border-divider-dark cursor-pointer ',
                    {
                        'hover:!border-dominant ': !onusMode,
                        '!bg-dominant border-dominant': !onusMode && active,
                        '!bg-gray-10 dark:!bg-dark-2 border-none': isDisable
                    },
                    {
                        'rounded-[3.2px]': onusMode,
                        'bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-[3.2px]': onusMode && !active,
                        '!bg-teal !border-teal': onusMode && active
                    },
                    boxContainerClassName
                )}
            >
                {isDisable ? <Check size={16} className="text-txtDisabled dark:text-txtDisabled-dark" /> : active && <Check size={16} className="text-white" />}
            </div>
            {label && <div className={classNames('text-sm text-txtSecondary dark:text-txtSecondary-dark', labelClassName)}>{label}</div>}
        </div>
    );
};

export default CheckBox;
