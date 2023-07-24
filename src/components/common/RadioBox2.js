import { Check } from 'react-feather';

import classNames from 'classnames';

const RadioBox = ({ id, label, description, checked, onusMode = false, onChange, isDark }) => {
    if (!id) return null;

    return (
        <div className="flex items-start mb-4 last:mb-0">
            <label>
                <input
                    type="radio"
                    id={id}
                    name="nami_radio_box"
                    value={id}
                    checked={!!checked}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className={classNames('absolute -z-[1px] opacity-0 cursor-pointer', { '!bg-dominant': checked })}
                />
                <span
                    className={classNames('w-5 h-5 rounded-[50%] inline-block relative border-[2px]  border-solid cursor-pointer', {
                        'hover:!border-dominant ': !onusMode,
                        'border-[#B5C0C9]': !checked,
                        'border-green-3 bg-green-3': checked
                    })}
                >
                    <Check
                        size={16}
                        className={classNames('absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-white', {
                            hidden: !checked,
                            'text-black': isDark
                        })}
                    />
                </span>
            </label>
            <div className="pl-2.5">
                <label htmlFor={id} className="font-medium text-sm cursor-pointer select-none">
                    {label}
                </label>
                {description && <div className="mt-0.5 text-xs text-txtSecondary dark:text-txtSecondary-dark">{description}</div>}
            </div>
        </div>
    );
};

export default RadioBox;
