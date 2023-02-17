import { useState } from 'react';
import { Search, X } from 'react-feather';
import { useTranslation } from 'next-i18next';

const SearchBoxV2 = ({ wrapperClassname = '', inputClassname = '', value, onChange, onFocus, width }) => {
    const { t } = useTranslation();

    return (
        <div
            className={
                'p-3 mt-3 lg:mt-0 w-[368px] flex items-center rounded-md bg-gray-10 dark:bg-dark-2 border border-transparent focus-within:border-teal' +
                wrapperClassname
            }
        >
            <Search size={width && width >= 768 ? 20 : 16} className="text-txtSecondary dark:text-txtSecondary-dark" />
            <input
                className={
                    'text-base font-normal w-full px-2.5 text-txtPrimary dark:text-txtPrimary-dark placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark ' +
                    inputClassname
                }
                value={value}
                onChange={(e) => {
                    onChange(e?.target?.value);
                }}
                placeholder={t('common:search')}
                onFocus={onFocus}
            />
            {value && <X size={width ? (width >= 768 ? 20 : 16) : 20} className="cursor-pointer" color="#8694b2" onClick={() => onChange('')} />}
        </div>
    );
};

export default SearchBoxV2;
