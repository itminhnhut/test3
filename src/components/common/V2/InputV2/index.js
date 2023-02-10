import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

const ErrorTriangle = ({ size = 16 }) => {
    return <svg width={size} height={size} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M7.335 6.667h1.333V10H7.335V6.667zm-.001 4h1.333V12H7.334v-1.333z' fill='#F93636' />
        <path
            d='M9.18 2.8A1.332 1.332 0 0 0 8 2.092c-.494 0-.946.271-1.178.709L1.93 12.043c-.22.417-.207.907.036 1.312.243.404.67.645 1.142.645h9.785c.472 0 .9-.241 1.143-.645s.257-.895.036-1.312L9.179 2.8zm-6.072 9.867L8 3.425l4.896 9.242h-9.79z'
            fill='#F93636' />
    </svg>;
};

const InputV2 = ({
    label,
    value,
    onChange,
    placeholder,
    canPaste = false,
    suffix,
    error = 'Check'
}) => {
    const { t } = useTranslation();

    const inputRef = useRef(null);

    const onInputChange = (e) => {
        if (onChange) onChange(e.target.value);
    };
    const paste = () => {
        navigator.clipboard.readText()
            .then(text => {
                if (onChange) {
                    onChange(text);
                }
            });
    };

    return <div className='relative pb-6'>
        {label && <p className='text-txtSecondary pb-2'>{label}</p>}
        <div className={classNames('bg-dark-2 border rounded-md flex p-3', {
            'border-dark-2': !error,
            'border-red': !!error
        })}>
            <input
                ref={inputRef}
                className='flex-1 !placeholder-darkBlue-5'
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={onInputChange}
            />
            {
                canPaste &&
                <span
                    onClick={paste}
                    className='text-teal font-semibold cursor-pointer select-none'
                >{t('common:paste')}</span>
            }
            {suffix && suffix}
        </div>
        <div className={classNames(
            'flex items-center h-4 mt-2 absolute bottom-0 inset-x', {
                'opacity-0': !error,
                'opacity-1': !!error
            })
        }>
            <ErrorTriangle size={12} />
            <span className='text-red text-xs ml-1'>{error}</span>
        </div>
    </div>;
};

export default InputV2;
