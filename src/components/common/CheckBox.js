import classNames from 'classnames';
import { Check } from 'react-feather';

const CheckBox = ({ active, boxContainerClassName, label, labelClassName, onChange, className, onusMode = false, isV3 = false, isDisable = false }) => {
    const onCheck = () => onChange && onChange();
    return (
        <div onClick={onCheck} className={classNames('flex items-center select-none cursor-pointer space-x-3 w-max', className)}>
            <div
                className={classNames(
                    'w-6 h-6 flex items-center justify-center rounded-[3px] border border-divider dark:border-divider-dark cursor-pointer ',
                    {
                        'hover:!border-dominant ': !onusMode,
                        '!bg-dominant border-dominant': !onusMode && active,
                        '!bg-dark-2 border-none': isDisable
                    },
                    {
                        'rounded-[3.2px]': onusMode,
                        'bg-onus-bg !border-onus-line rounded-[3.2px]': onusMode && !active,
                        '!bg-onus-base !border-onus-base': onusMode && active
                    },
                    boxContainerClassName
                )}
            >
                {isDisable ? <Check size={18} className="text-txtDisabled dark:text-txtDisabled-dark" /> : active && <Check size={18} className="text-white" />}
            </div>
            {label && <div className={classNames('text-sm text-txtSecondary dark:text-txtSecondary-dark', labelClassName)}>{label}</div>}
        </div>
    );
};

export default CheckBox;
