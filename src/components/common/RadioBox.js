import classNames from 'classnames';

const RadioBox = ({ id, label, description, checked, onChange, classNameInput }) => {
    if (!id) return null;

    return (
        <div className="flex items-start">
            <input
                type="radio"
                id={id}
                name="nami_radio_box"
                value={id}
                checked={!!checked}
                onChange={(e) => onChange && onChange(e.target.value)}
                className={classNames('mt-1.5 cursor-pointer', { '!bg-dominant': checked }, classNameInput)}
            />
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
