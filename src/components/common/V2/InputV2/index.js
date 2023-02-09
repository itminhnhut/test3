import { useRef } from 'react';
import { useTranslation } from 'next-i18next';

const InputV2 = ({
    label,
    value,
    onChange,
    placeholder,
    canPaste
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

    return <div>
        {label && <p className='text-txtSecondary pb-2'>{label}</p>}
        <div className='bg-dark-2 rounded-md flex p-3'>
            <input
                ref={inputRef}
                className='flex-1 !placeholder-darkBlue-5'
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={onInputChange}
            />
            {canPaste}
            <span
                onClick={paste}
                className='text-teal font-semibold cursor-pointer select-none'
            >{t('common:paste')}</span>
        </div>
    </div>;
};

export default InputV2;
