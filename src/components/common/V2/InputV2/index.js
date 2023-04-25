import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { X } from 'react-feather';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import ErrorTriggers from 'components/svg/ErrorTriggers';

const ErrorTriangle = ({ size = 16 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.335 6.667h1.333V10H7.335V6.667zm-.001 4h1.333V12H7.334v-1.333z" fill="#F93636" />
            <path
                d="M9.18 2.8A1.332 1.332 0 0 0 8 2.092c-.494 0-.946.271-1.178.709L1.93 12.043c-.22.417-.207.907.036 1.312.243.404.67.645 1.142.645h9.785c.472 0 .9-.241 1.143-.645s.257-.895.036-1.312L9.179 2.8zm-6.072 9.867L8 3.425l4.896 9.242h-9.79z"
                fill="#F93636"
            />
        </svg>
    );
};

const InputV2 = ({
    className,
    label,
    value,
    onChange,
    placeholder,
    canPaste = false,
    allowClear = true,
    prefix,
    suffix,
    error,
    onHitEnterButton,
    type = 'text',
    disabled = false,
    classNameInput = '',
    classNameDivInner = '',
    ...restProps
}) => {
    const { t } = useTranslation();

    const inputRef = useRef(null);
    const internalChange = (value) => {
        if (onChange) onChange(value);
    };
    const onInputChange = (e) => {
        internalChange(e?.target?.value);
    };
    const handleHitEnterButton = (e) => {
        if (e?.nativeEvent?.code === 'Enter') {
            if (onHitEnterButton) onHitEnterButton(e?.target?.value);
        }
    };

    const handleClear = () => {
        internalChange('');
    };

    const paste = () => {
        navigator.clipboard.readText().then((text) => {
            if (onChange) {
                onChange(text);
            }
        });
    };

    return (
        <div className={classNames('relative pb-6', className)}>
            {label ? <p className="text-txtSecondary pb-2">{label}</p> : null}
            <div
                className={classNames(
                    'bg-gray-10 dark:bg-dark-2 border border-transparent rounded-md flex items-center gap-2 p-[0.6875rem] transition',
                    'dark:focus-within:border-teal focus-within:border-green-3 dark:border-dark-2',
                    {
                        '!border-red': !!error,
                        'text-txtDisabled dark:text-txtDisabled-dark select-none': disabled
                    },
                    classNameDivInner
                )}
            >
                {prefix ? prefix : null}
                <input
                    ref={inputRef}
                    className={classNames(
                        'flex-1 text-sm sm:text-base !placeholder-txtSecondary dark:!placeholder-txtSecondary-dark text-txtPrimary dark:text-txtPrimary-dark',
                        classNameInput
                    )}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    onChange={onInputChange}
                    onKeyPress={onHitEnterButton ? handleHitEnterButton : null}
                    {...restProps}
                />
                <div className="flex items-center divide-x divide-divider dark:divide-divider-dark space-x-2">
                    <X
                        className={classNames('transition', allowClear && !!value ? 'opacity-1 cursor-pointer' : 'opacity-0')}
                        size={16}
                        onClick={handleClear}
                        color={colors.darkBlue5}
                    />
                    {suffix && <div className="pl-2">{suffix}</div>}
                </div>
                {canPaste ? (
                    <span onClick={paste} className="text-teal font-semibold cursor-pointer select-none">
                        {t('common:paste')}
                    </span>
                ) : null}
            </div>

            <div
                className={classNames('overflow-hidden transition-[max-height_opacity] duration-300', {
                    'max-h-0 opacity-0 ease-out': !error,
                    'max-h-[5rem] opacity-1 ease-in': !!error
                })}
            >
                <div className="flex items-center mt-2">
                    <ErrorTriggers />
                    <div className="text-red text-xs leading-4 ml-1">{error}</div>
                </div>
            </div>
        </div>
    );
};

export default InputV2;
