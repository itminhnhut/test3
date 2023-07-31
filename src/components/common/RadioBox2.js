import classNames from 'classnames';

const RadioBox2 = ({ id, label, description, checked, onusMode = false, onChange, isDark }) => {
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
                    className={classNames(
                        'w-5 h-5 rounded-[50%] dark:border-divider-dark border-divider inline-block relative border-[0.5px] bg-dark-12 dark:bg-dark-2  border-solid cursor-pointer',
                        {
                            'hover:!border-dominant ': !onusMode,
                            'after:bg-green-3 dark:after:bg-green-2 after:content-[""] after:w-[15px] after:h-[15px] after:rounded-full after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%]':
                                checked
                        }
                    )}
                ></span>
            </label>
            <div className="pl-2.5">
                <label htmlFor={id} className="cursor-pointer select-none text-gray-1 dark:text-gray-7">
                    {label}
                </label>
                {description && <div className="mt-0.5 text-xs text-txtSecondary dark:text-txtSecondary-dark">{description}</div>}
            </div>
        </div>
    );
};

export default RadioBox2;
